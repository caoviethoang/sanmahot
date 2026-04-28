class Scrapers::LazadaScraper < Scrapers::BaseScraper
  def parse
    browser.mouse.scroll_to(0, 500)
    sleep 2

    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css("[class*='coupon'], [class*='voucher'], [class*='promo']").each do |el|
      code = (el.at_css("[class*='code'], [data-code]")&.text || el["data-code"])&.strip
      next if code.blank?

      title_el = el.at_css("[class*='title'], [class*='name'], h3, h4, p")
      coupons << {
        code:        code.upcase,
        title:       title_el&.text&.strip || "Mã giảm giá Lazada",
        description: el.text.strip[0..200]
      }
    end

    coupons += extract_codes_from_text(doc.text) if coupons.empty?
    coupons
  end
end
