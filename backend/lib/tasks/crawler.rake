namespace :crawl do
  desc "Crawl latest promotional articles from magiamgia.com"
  task magiamgia: :environment do
    require "nokogiri"
    require "open-uri"

    sections = [
      { url: "https://magiamgia.com/tin-khuyen-mai/", category: "Tin Khuyến Mãi" },
      { url: "https://magiamgia.com/huong-dan/", category: "Hướng Dẫn" }
    ]

    headers = {
      "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    sections.each do |section|
      base_url = section[:url]
      cat_name = section[:category]
      puts "🚀 Starting crawl for section: #{cat_name} (#{base_url})"

      begin
        all_links = []
        (1..3).each do |page_num|
          page_url = page_num == 1 ? base_url : "#{base_url}page/#{page_num}/"
          puts "📡 Fetching list from: #{page_url}"
          begin
            page_html = URI.open(page_url, headers)
            page_doc = Nokogiri::HTML(page_html)

            page_links = page_doc.css("a").map { |a| a["href"] }.compact.uniq.select do |href|
              href.start_with?("https://magiamgia.com/") &&
              href.count("-") >= 2 &&
              !href.include?("/category/") &&
              !href.include?("/tag/") &&
              !href.include?("-so-sanh-") &&
              href != base_url
            end
            all_links.concat(page_links)
          rescue => e
            puts "⚠️ Could not fetch page #{page_num}: #{e.message}"
          end
        end

        all_links = all_links.uniq
        puts "✅ Found #{all_links.count} potential article links in #{cat_name}. Processing all..."

        all_links.each do |article_url|
          puts "\n🔍 [#{cat_name}] Processing: #{article_url}"
          begin
            article_html = URI.open(article_url, headers)
            article_doc = Nokogiri::HTML(article_html)

            title = article_doc.css("h1").text.strip

            content_node = article_doc.css(".elementor-widget-theme-post-content").first ||
                           article_doc.css(".entry-content").first ||
                           article_doc.css(".post-content").first ||
                           article_doc.css("article").first

            if content_node.nil? || title.blank?
              puts "⚠️ Could not extract title or content nodes. Skipping."
              next
            end

            content_node.search(".comment-area, script, style, iframe, .sidebar, .related-posts").remove

            slug = article_url.split("/").reject(&:empty?).last

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

            raw_content = content_node.inner_html.strip

            img_nodes = article_doc.css('.entry-content img, .elementor-widget-theme-post-content img, .featured-image img, meta[property="og:image"]')
            image_url = img_nodes.map { |node| node["content"] || node["src"] || node["data-lazy-src"] || node["data-src"] }
                                .compact
                                .reject { |url| url.start_with?("data:image") || url.include?("facebook-image-default") }
                                .first

            article = Article.find_or_initialize_by(slug: slug)
            article.title = title
            article.content = raw_content
            article.image_url = image_url
            article.category = cat_name # Force the section category
            article.status = :published

            # Detect platform
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

            json_ld = article_doc.css('script[type="application/ld+json"]').text
            published_date_str = json_ld.match(/"datePublished":"([^"]+)"/)&.[](1)
            article.published_at = published_date_str ? Time.parse(published_date_str) : Time.current

            excerpt_text = Nokogiri::HTML(raw_content).text.gsub(/\s+/, " ").strip
            article.excerpt = excerpt_text[0..200] + "..."
            article.meta_title = title
            article.meta_description = excerpt_text[0..155]

            if article.save
              puts "🎉 Success: Saved [#{article.title}] as #{article.category}"
            else
              puts "❌ Failed to save: #{article.errors.full_messages}"
            end

            sleep 1
          rescue => e
            puts "❌ Error crawling #{article_url}: #{e.message}"
          end
        end
        puts "✅ Finished section: #{cat_name}"
      rescue => e
        puts "❌ Critical Error in section #{cat_name}: #{e.message}"
      end
    end
    puts "✨ All sections finished."
  end
end
