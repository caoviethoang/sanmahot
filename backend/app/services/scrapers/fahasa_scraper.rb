class Scrapers::FahasaScraper < Scrapers::BaseScraper
  def parse
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

    coupons += extract_codes_from_text(doc.text) if coupons.empty?
    coupons.uniq { |c| c[:code] }
  end
end
