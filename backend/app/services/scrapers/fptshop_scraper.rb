class Scrapers::FptshopScraper < Scrapers::BaseScraper
  def parse
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

    coupons += extract_codes_from_text(doc.text) if coupons.empty?
    coupons.uniq { |c| c[:code] }
  end
end
