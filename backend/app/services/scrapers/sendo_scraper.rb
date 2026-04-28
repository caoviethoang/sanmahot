class Scrapers::SendoScraper < Scrapers::BaseScraper
  def parse
    browser.mouse.scroll_to(0, 1000)
    sleep 3

    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='voucher'], [class*='code-item']").each do |el|
      code = el.at_css("[class*='code']")&.text&.strip
      next if code.blank? || code.length > 30

      coupons << {
        code:        code.upcase,
        title:       el.at_css("h3, h4, [class*='title']")&.text&.strip || "Mã giảm giá Sendo",
        description: el.text.strip[0..200],
        end_at:      parse_date_from_text(el.text)
      }
    end

    coupons += extract_codes_from_text(doc.text) if coupons.empty?
    coupons
  end
end
