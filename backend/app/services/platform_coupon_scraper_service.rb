require "ferrum"
require "nokogiri"

# PlatformCouponScraperService
#
# Scrapes public voucher/coupon pages of Vietnamese e-commerce platforms.
# Uses Ferrum (Headless Browser) to bypass bot protection and render JS.
#
class PlatformCouponScraperService
  PLATFORM_URLS = {
    "lazada"       => "https://lazada.vn",
    "sendo"        => "https://sendo.vn",
    "fptshop"      => "https://fptshop.com.vn",
    "nguyenkim"    => "https://nguyenkim.com",
    "fahasa"       => "https://fahasa.com",
    "dienmayxanh"  => "https://dienmayxanh.com",
    "grab"         => "https://grab.com/vn",
    "vnpay"        => "https://vnpay.vn",
    "xanhsm"       => "https://xanhsm.com",
    "shopeefood"   => "https://shopeefood.vn"
  }.freeze

  SCRAPE_TARGETS = [
    {
      platform: "lazada",
      label:    "Lazada",
      url:      "https://www.lazada.vn/shop/coupon-center/",
      parser:   :parse_lazada
    },
    {
      platform: "sendo",
      label:    "Sendo",
      url:      "https://www.sendo.vn/khuyen-mai/",
      parser:   :parse_sendo
    },
    {
      platform: "fptshop",
      label:    "FPT Shop",
      url:      "https://fptshop.com.vn/uu-dai",
      parser:   :parse_fptshop
    },
    {
      platform: "nguyenkim",
      label:    "Nguyenkim",
      url:      "https://www.nguyenkim.com/khuyen-mai/",
      parser:   :parse_nguyenkim
    },
    {
      platform: "fahasa",
      label:    "Fahasa",
      url:      "https://www.fahasa.com/khuyen-mai.html",
      parser:   :parse_fahasa
    },
    {
      platform: "dienmayxanh",
      label:    "Điện Máy Xanh",
      url:      "https://www.dienmayxanh.com/khuyen-mai",
      parser:   :parse_generic
    },
    {
      platform: "grab",
      label:    "Grab",
      url:      "https://www.grab.com/vn/khuyen-mai/",
      parser:   :parse_generic
    },
    {
      platform: "vnpay",
      label:    "VNPAY",
      url:      "https://vnpay.vn/tin-khuyen-mai",
      parser:   :parse_generic
    },
    {
      platform: "xanhsm",
      label:    "XanhSM",
      url:      "https://www.xanhsm.com/khuyen-mai/",
      parser:   :parse_generic
    }
  ].freeze

  def initialize
    @options = {
      window_size: [ 1366, 768 ],
      browser_options: {
        "no-sandbox": nil,
        "disable-dev-shm-usage": nil,
        "disable-gpu": nil
      },
      timeout: 60
    }
    @options[:browser_path] = "/usr/bin/chromium" if File.exist?("/usr/bin/chromium")
  end

  def run
    total = 0
    browser = Ferrum::Browser.new(@options)

    begin
      SCRAPE_TARGETS.each do |target|
        begin
          Rails.logger.info "🛒 Đang scrape coupon #{target[:label]} via Ferrum..."
          browser.goto(target[:url])
          sleep 5 # Wait for initial render

          coupons = send(target[:parser], browser)
          saved   = save_coupons(coupons, target[:platform], target[:label])
          Rails.logger.info "Đã lưu #{saved} coupon từ #{target[:label]}"
          total += saved
        rescue => e
          Rails.logger.error " Lỗi scrape #{target[:label]}: #{e.message}"
        end
      end
    ensure
      browser.quit
    end

    Rails.logger.info "🏁 Tổng cộng đã thêm #{total} coupon từ các sàn."
    total
  end

  private

  # ─────────────────────────────────────────────────────────────────────────────
  # PARSERS
  # ─────────────────────────────────────────────────────────────────────────────

  def parse_lazada(browser)
    # Scroll to trigger lazy loading if any
    browser.mouse.scroll_to(0, 500)
    sleep 2

    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='voucher'], [class*='promo']").each do |el|
      code_el  = el.at_css("[class*='code'], [data-code]")
      title_el = el.at_css("[class*='title'], [class*='name'], h3, h4, p")
      next unless code_el || el["data-code"]

      code = (code_el&.text || el["data-code"])&.strip
      next if code.blank?

      coupons << {
        code:        code.upcase,
        title:       title_el&.text&.strip || "Mã giảm giá Lazada",
        description: el.text.strip[0..200]
      }
    end

    coupons += extract_codes_from_text(doc.text, "Lazada") if coupons.empty?
    coupons
  end

  def parse_sendo(browser)
    # Sendo might need some scrolling to load items
    browser.mouse.scroll_to(0, 1000)
    sleep 3

    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='voucher'], [class*='code-item']").each do |el|
      code_el = el.at_css("[class*='code']")
      next unless code_el

      code = code_el.text.strip
      next if code.blank? || code.length > 30

      coupons << {
        code:        code.upcase,
        title:       el.at_css("h3, h4, [class*='title']")&.text&.strip || "Mã giảm giá Sendo",
        description: el.text.strip[0..200],
        end_at:      parse_date_from_text(el.text)
      }
    end

    coupons += extract_codes_from_text(doc.text, "Sendo") if coupons.empty?
    coupons
  end

  def parse_fptshop(browser)
    browser.mouse.scroll_to(0, 1000)
    sleep 3

    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='voucher'], [class*='promo'], article").each do |el|
      code_el = el.at_css("[class*='code'], .coupon-code, .voucher-code, strong, b")
      next unless code_el

      code = code_el.text.strip.gsub(/\s+/, "")
      next if code.blank? || code.length > 25 || code =~ /\A\d{4,}\z/

      coupons << {
        code:        code.upcase,
        title:       el.at_css("h1, h2, h3, h4, [class*='title']")&.text&.strip || "Mã giảm giá FPT Shop",
        description: el.text.strip[0..200],
        end_at:      parse_date_from_text(el.text)
      }
    end

    coupons += extract_codes_from_text(doc.text, "FPT Shop") if coupons.empty?
    coupons.uniq { |c| c[:code] }
  end

  def parse_nguyenkim(browser)
    doc = Nokogiri::HTML(browser.body)
    coupons = []

    # Nguyenkim lists vouchers in specific promo blocks or product descriptions
    # Targeting specific container elements for better titles
    doc.css(".product-item, .item-card, .nk-product-item, .promo-banner-text, .product-render").each do |el|
      text = el.text

      # Try to find a specific title element first
      title_el = el.at_css(".product-name, .nk-product-name, .p-name, h3, h4")
      title = title_el&.text&.strip

      codes = text.scan(/\b([A-Z0-9]{5,15})\b/).flatten
      codes.each do |c|
        next if is_fake_code?(c)

        discount = extract_discount_from_text(text)

        # Build a better title
        display_title = if title.present? && discount.present?
                          "#{title} (Giảm #{discount})"
        elsif title.present?
                          title
        elsif discount.present?
                          "Giảm #{discount} tại Nguyenkim"
        else
                          "Mã giảm giá Nguyenkim"
        end

        coupons << {
          code:        c.upcase.gsub(/\s+/, ""),
          title:       display_title,
          description: text.strip.gsub(/\s+/, " ")[0..200],
          end_at:      parse_date_from_text(text)
        }
      end
    end

    coupons += extract_codes_from_text(doc.text, "Nguyenkim") if coupons.empty?
    coupons.uniq { |c| [ c[:code], c[:title] ] } # Deduplicate by code and title
  end

  def parse_fahasa(browser)
    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='code'], [class*='voucher']").each do |el|
      code = el["data-code"] || el.text.strip.scan(/\b[A-Z0-9]{5,20}\b/).first
      next if code.blank?

      coupons << {
        code:        code.upcase,
        title:       "Mã giảm giá Fahasa",
        description: el.text.strip[0..200],
        end_at:      parse_date_from_text(el.text)
      }
    end

    coupons += extract_codes_from_text(doc.text, "Fahasa") if coupons.empty?
    coupons.uniq { |c| c[:code] }
  end

  def parse_generic(browser)
    # Optimized generic parser for informational/blog style promo pages
    doc = Nokogiri::HTML(browser.body)
    extract_codes_from_text(doc.text, "Khuyến mãi")
  end

  # ─────────────────────────────────────────────────────────────────────────────
  # HELPERS
  # ─────────────────────────────────────────────────────────────────────────────

  def extract_codes_from_text(text, platform_label)
    return [] if text.blank?

    # Remove script/style contents first to avoid technical noise
    clean_text = text.gsub(/<script.*?>.*?<\/script>/im, "")
                     .gsub(/<style.*?>.*?<\/style>/im, "")
                     .gsub(/\{.*?\}/m, " ") # Remove anything that looks like JSON or JS objects
                     .gsub(/\s+/, " ")

    potential_codes = clean_text.scan(/\b([A-Z0-9]{5,20})\b/).flatten.uniq
    clean_codes = potential_codes.reject { |c| is_fake_code?(c) }.first(12)

    clean_codes.map do |code|
      # Avoid context that looks like code
      context_window = clean_text[/[^.]{0,100}#{Regexp.escape(code)}[^.]{0,100}/i] || ""
      next if context_window =~ /[{}=\[\]<>]/ # Contains code-like characters

      discount_info = extract_discount_from_text(context_window)

      # Better title heuristic: look for meaningful words before/after
      title_part = context_window.gsub(code, "").gsub(/[^p{L}0-9\s]/u, "").strip[0..40]
      title_part = platform_label if title_part.blank? || title_part.length < 5

      {
        code:        code,
        title:       discount_info.present? ? "Giảm #{discount_info} - #{platform_label}" : "Mã #{code} - #{title_part}",
        description: "Mã #{code} — #{discount_info.present? ? "Ưu đãi #{discount_info}" : platform_label}",
        end_at:      parse_date_from_text(context_window)
      }
    end.compact
  end

  def is_fake_code?(code)
    # Filter 3, 6, 8 char hex colors

    # Filter technical keywords
    tech_keywords = %w[HTTP HTML JSON TRUE NULL FREE SALE MORE BEST VIEW NEWS BLOG CACHE VERSION UTF8 WIDTH HEIGHT COLOR FFFFFF 000000 STATIC ASSETS WINDOWS MSXML2 LBBROWSER]
    return true if tech_keywords.include?(code.upcase)

    # Filter if purely numbers
    return true if code =~ /\A\d+\z/

    # Filter if looks like a timestamp/year (e.g. 2024, 2025)
    return true if code =~ /\A20\d{2}\z/

    false
  end

  def extract_discount_from_text(text)
    return nil if text.blank?

    patterns = [
      /giảm\s*(\d+\s*%)/i,
      /giảm\s*(\d+[kK])\b/i,
      /giảm\s*([\d\.]+\s*(?:đ|vnđ|vnd))/i,
      /giá(?:\s*chỉ)?\s*([\d\.]+\s*(?:đ|vnđ|vnd))/i,
      /-\s*(\d+\s*%)/i,
      /ưu\s*đãi\s*(\d+\s*%)/i,
      /(\d+\s*%)\s*OFF/i
    ]

    patterns.each do |pattern|
      match = text.match(pattern)
      return match[1] if match
    end

    nil
  end

  def parse_date_from_text(text)
    return nil if text.blank?
    match = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
    return nil unless match
    Time.zone.parse("#{match[3]}-#{match[2]}-#{match[1]}") rescue nil
  end

  def find_affiliate_url(platform)
    url = Coupon.where(platform: platform).where.not(affiliate_url: [ nil, "" ])
                .order(updated_at: :desc).pick(:affiliate_url)
    url ||= Deal.where("source_platform ILIKE ?", "%#{platform}%")
                .where.not(affiliate_url: [ nil, "" ])
                .order(updated_at: :desc).pick(:affiliate_url)
    url || PLATFORM_URLS[platform]
  end

  def save_coupons(coupons_data, platform, label)
    saved = 0
    coupons_data.each do |item|
      next if item[:code].blank?
      aff_url = find_affiliate_url(platform)
      category_name = case platform
      when "fptshop", "nguyenkim", "tgdd" then "Điện tử"
      when "fahasa"                        then "Sách"
      when "concung", "bibomart"           then "Mẹ & Bé"
      else "Ưu đãi"
      end

      coupon = Coupon.find_or_initialize_by(code: item[:code], platform: platform)
      coupon.assign_attributes(
        title:         item[:title] || "Mã giảm giá #{label}",
        description:   item[:description],
        affiliate_url: aff_url,
        start_at:      Time.current,
        end_at:        item[:end_at],
        category:      category_name,
        terms:         item[:description],
        target_users:  "Tất cả khách hàng",
        status:        :active,
        is_hot:        false
      )
      next if coupon.end_at.present? && coupon.end_at < Time.current
      saved += 1 if coupon.save
    end
    saved
  end
end
