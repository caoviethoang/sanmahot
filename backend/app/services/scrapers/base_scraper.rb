class Scrapers::BaseScraper
  attr_reader :browser, :platform, :label

  def initialize(browser, platform, label)
    @browser = browser
    @platform = platform
    @label = label
  end

  def run
    Rails.logger.info "🛒 Scraper: Starting #{label}..."
    coupons = parse
    saved = save_coupons(coupons)
    Rails.logger.info "✅ Scraper: Saved #{saved} coupons from #{label}"
    saved
  end

  protected

  def parse
    raise NotImplementedError, "Subclasses must implement parse"
  end

  def extract_codes_from_text(text)
    return [] if text.blank?

    clean_text = text.gsub(/<script.*?>.*?<\/script>/im, "")
                     .gsub(/<style.*?>.*?<\/style>/im, "")
                     .gsub(/\{.*?\}/m, " ")
                     .gsub(/\s+/, " ")

    potential_codes = clean_text.scan(/\b([A-Z0-9]{5,20})\b/).flatten.uniq
    clean_codes = potential_codes.reject { |c| is_fake_code?(c) }.first(12)

    clean_codes.map do |code|
      context_window = clean_text[/[^.]{0,100}#{Regexp.escape(code)}[^.]{0,100}/i] || ""
      next if context_window =~ /[{}=\[\]<>]/

      discount = extract_discount_from_text(context_window)
      title_part = context_window.gsub(code, "").gsub(/[^p{L}0-9\s]/u, "").strip[0..40]
      title_part = label if title_part.blank? || title_part.length < 5

      {
        code:        code,
        title:       discount.present? ? "Giảm #{discount} - #{label}" : "Mã #{code} - #{title_part}",
        description: "Mã #{code} — #{discount.present? ? "Ưu đãi #{discount}" : label}",
        end_at:      parse_date_from_text(context_window)
      }
    end.compact
  end

  def is_fake_code?(code)
    return true if [ 3, 4, 6, 8 ].include?(code.length) && code =~ /^[A-F0-9]+$/i
    tech_keywords = %w[HTTP HTML JSON TRUE NULL FREE SALE MORE BEST VIEW NEWS BLOG CACHE VERSION UTF8 WIDTH HEIGHT COLOR FFFFFF 000000 STATIC ASSETS WINDOWS MSXML2 LBBROWSER]
    return true if tech_keywords.include?(code.upcase)
    return true if code =~ /\A\d+\z/ || code =~ /\A20\d{2}\z/
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

  def save_coupons(coupons_data)
    saved = 0
    coupons_data.each do |item|
      next if item[:code].blank?

      coupon = Coupon.find_or_initialize_by(code: item[:code], platform: platform)
      coupon.assign_attributes(
        title:         item[:title] || "Mã giảm giá #{label}",
        description:   item[:description],
        affiliate_url: find_affiliate_url,
        start_at:      Time.current,
        end_at:        item[:end_at],
        category:      determine_category,
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

  def find_affiliate_url
    url = Coupon.where(platform: platform).where.not(affiliate_url: [ nil, "" ])
                .order(updated_at: :desc).pick(:affiliate_url)
    url ||= Deal.where("source_platform ILIKE ?", "%#{platform}%")
                .where.not(affiliate_url: [ nil, "" ])
                .order(updated_at: :desc).pick(:affiliate_url)
    url || PlatformCouponScraperService::PLATFORM_URLS[platform]
  end

  def determine_category
    case platform
    when "fptshop", "nguyenkim", "tgdd", "dienmayxanh" then "Điện tử"
    when "fahasa"                                      then "Sách"
    when "concung", "bibomart"                         then "Mẹ & Bé"
    when "shopeefood", "grab"                          then "Ẩm thực"
    else "Ưu đãi"
    end
  end
end
