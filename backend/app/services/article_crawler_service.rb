require "nokogiri"
require "open-uri"

class ArticleCrawlerService
  def initialize
    @headers = {
      "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    @sections = [
      { url: "https://magiamgia.com/tin-khuyen-mai/", category: "Tin Khuyến Mãi" },
      { url: "https://magiamgia.com/huong-dan/", category: "Hướng Dẫn" }
    ]
  end

  def crawl_all
    @sections.each do |section|
      crawl_section(section)
    end
  end

  private

  def crawl_section(section)
    base_url = section[:url]
    cat_name = section[:category]
    Rails.logger.info "🚀 Starting crawl for section: #{cat_name} (#{base_url})"

    begin
      all_items = []
      (1..3).each do |page_num|
        page_url = page_num == 1 ? base_url : "#{base_url}page/#{page_num}/"
        fetch_page_items(page_url, all_items)
      end

      all_items = all_items.uniq { |item| item[:url] }
      Rails.logger.info "Found #{all_items.count} potential articles in #{cat_name}. Processing..."

      all_items.each do |item|
        process_article(item, cat_name)
      end
      Rails.logger.info "Finished section: #{cat_name}"
    rescue => e
      Rails.logger.error "Critical Error in section #{cat_name}: #{e.message}"
    end
  end

  def fetch_page_items(page_url, all_items)
    Rails.logger.info "Fetching list from: #{page_url}"
    begin
      page_html = URI.open(page_url, @headers)
      page_doc = Nokogiri::HTML(page_html)

      # Target Elementor post structure
      page_doc.css("article.elementor-post").each do |article_node|
        link_node = article_node.css(".elementor-post__title a").first
        next unless link_node

        url = link_node["href"]
        title_from_list = link_node.text.strip
        date_str = article_node.css(".elementor-post-date").text.strip
        thumb_url = article_node.css(".elementor-post__thumbnail img").first&.attr("data-src") ||
                    article_node.css(".elementor-post__thumbnail img").first&.attr("src")

        all_items << {
          url: url,
          title: title_from_list,
          date: date_str,
          thumbnail: thumb_url
        }
      end
    rescue => e
      Rails.logger.warn "Could not fetch page #{page_url}: #{e.message}"
    end
  end

  def process_article(item, cat_name)
    article_url = item[:url]
    Rails.logger.info "\n🔍 [#{cat_name}] Processing: #{article_url}"
    begin
      # Skip if it's the category page itself (shouldn't happen with new selector but double check)
      if @sections.any? { |s| s[:url] == article_url }
        Rails.logger.info "Skipping category page: #{article_url}"
        return
      end

      article_html = URI.open(article_url, @headers)
      article_doc = Nokogiri::HTML(article_html)

      # Specific title selectors
      title = article_doc.css("h1.elementor-heading-title").text.strip
      title = item[:title] if title.blank? || title == cat_name

      content_node = article_doc.css(".elementor-widget-theme-post-content").first ||
                     article_doc.css(".entry-content").first ||
                     article_doc.css("article").first

      if content_node.nil? || title.blank? || title == cat_name
        Rails.logger.warn "Missing title or content. Skipping."
        return
      end

      clean_content(content_node)
      slug = article_url.split("/").reject(&:empty?).last
      process_images(content_node)
      linkify_urls(content_node)
      replace_brand_mentions(content_node)

      raw_content = content_node.inner_html.strip

      # Sanitize content and metadata
      sanitized_title = replace_brand_keywords(title)
      image_url = extract_featured_image(article_doc) || item[:thumbnail]

      article = Article.find_or_initialize_by(slug: slug)
      article.assign_attributes(
        title:      sanitized_title,
        content:    raw_content,
        image_url:  image_url,
        category:   cat_name,
        status:     :published
      )

      detect_platform(article, sanitized_title, raw_content)
      parse_published_at(article, article_doc, item[:date])
      generate_meta_and_excerpt(article, sanitized_title, raw_content)

      if article.save
        Rails.logger.info "✅ Success: Saved [#{article.title}] [#{article.published_at}]"
      else
        Rails.logger.error "❌ Failed to save: #{article.errors.full_messages}"
      end

      sleep 1
    rescue => e
      Rails.logger.error "Error crawling #{article_url}: #{e.message}"
    end
  end

  def clean_content(content_node)
    content_node.search(".comment-area, script, style, iframe, .sidebar, .related-posts, .elementor-post-navigation").remove

    promo_keywords = [
      "m.me/", "t.me/", "zalo.me/", "fanpage facebook", "group facebook",
      "kênh telegram", "facebook.com/magiamgia", "magiamgiadotcom"
    ]

    # Remove entire paragraphs or list items containing promotion text
    content_node.css("p, li").each do |node|
      text = node.text.downcase
      if promo_keywords.any? { |kw| text.include?(kw) }
        node.remove
      end
    end

    # Remove any leftover stray social links
    content_node.css("a").each do |link|
      href = link["href"].to_s.downcase
      if href.include?("m.me/") || href.include?("t.me/") || href.include?("zalo.me/") || href.include?("facebook.com/")
        link.remove
      end
    end
  end

  def process_images(content_node)
    content_node.css("img").each do |img|
      real_src = img["data-lazy-src"] || img["data-src"] || img["src"]
      if real_src && !real_src.start_with?("data:image")
        img["src"] = real_src
        img.remove_attribute("data-lazy-src")
        img.remove_attribute("data-src")
        img.remove_attribute("srcset")
        img.classes.delete("lazyload")
      end
    end
  end

  def linkify_urls(content_node)
    url_regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/
    content_node.xpath(".//text()").each do |text_node|
      next if text_node.parent.name == "a" || text_node.parent.name == "script" || text_node.parent.name == "style"
      if text_node.content =~ url_regex
        new_html = text_node.content.gsub(url_regex) do |match|
          "<a href='#{match}' target='_blank' rel='nofollow' style='color: #2563eb !important; font-weight: bold !important; text-decoration: underline !important;'>#{match}</a>"
        end
        text_node.replace(Nokogiri::HTML.fragment(new_html))
      end
    end
  end

  def replace_brand_mentions(content_node)
    content_node.xpath(".//text()").each do |text_node|
      next if %w[script style].include?(text_node.parent.name)
      original_text = text_node.content
      next if original_text.blank?

      new_text = replace_brand_keywords(original_text)
      text_node.content = new_text if new_text != original_text
    end

    content_node.css("a").each do |link|
      href = link["href"].to_s
      if href.downcase.include?("magiamgia.com")
        link["href"] = "/"
      end
    end
  end

  def extract_featured_image(article_doc)
    # Target featured image widget specifically
    img_node = article_doc.css(".elementor-widget-theme-post-featured-image img, meta[property='og:image']").first
    return nil unless img_node

    url = img_node["content"] || img_node["data-src"] || img_node["src"]

    # Exclude generic site-wide default images
    if url.nil? || url.start_with?("data:image") || url.include?("facebook-image-default")
      return nil
    end

    url
  end

  def detect_platform(article, title, raw_content)
    combined_text = "#{title} #{raw_content}".downcase
    if combined_text.include?("shopee")
      article.platform = "shopee"
    elsif combined_text.include?("lazada")
      article.platform = "lazada"
    elsif combined_text.include?("tiki")
      article.platform = "tiki"
    elsif combined_text.include?("shopeefood")
      article.platform = "shopeefood"
    elsif combined_text.include?("nguyenkim") || combined_text.include?("nguyễn kim")
      article.platform = "nguyenkim"
    end
  end

  def parse_published_at(article, article_doc, list_date_str)
    json_ld = article_doc.css('script[type="application/ld+json"]').text
    published_date_str = json_ld.match(/"datePublished":"([^"]+)"/)&.[](1)

    if published_date_str
      article.published_at = Time.parse(published_date_str)
    elsif list_date_str.present?
      begin
        # Assuming list format is DD/MM/YYYY
        article.published_at = Date.strptime(list_date_str, "%d/%m/%Y").to_time
      rescue
        article.published_at = Time.current
      end
    else
      article.published_at = Time.current
    end
  end

  def generate_meta_and_excerpt(article, title, raw_content)
    excerpt_text = Nokogiri::HTML(raw_content).text.gsub(/\s+/, " ").strip
    article.excerpt = excerpt_text[0..200] + "..."
    article.meta_title = title
    article.meta_description = excerpt_text[0..155]
  end

  def replace_brand_keywords(text)
    return text if text.blank?
    text.gsub(/magiamgia\.com/i, "sanmahot.com")
        .gsub(/\bmagiamgia\b/i, "sanmahot")
        .gsub("Mã Giảm Giá", "Săn Mã Hot")
        .gsub("Mã giảm giá", "Săn mã hot")
        .gsub("mã giảm giá", "săn mã hot")
        .gsub("Magiamgia", "Sanmahot")
  end
end
