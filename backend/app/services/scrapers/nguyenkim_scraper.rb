class Scrapers::NguyenkimScraper < Scrapers::BaseScraper
  def parse
    doc = Nokogiri::HTML(browser.body)
    coupons = []

    doc.css(".product-item, .item-card, .nk-product-item, .promo-banner-text, .product-render").each do |el|
      text = el.text
      title_el = el.at_css(".product-name, .nk-product-name, .p-name, h3, h4")
      title = title_el&.text&.strip

      codes = text.scan(/\b([A-Z0-9]{5,15})\b/).flatten
      codes.each do |c|
        next if is_fake_code?(c)

        discount = extract_discount_from_text(text)
        display_title = format_title(title, discount)

        coupons << {
          code:        c.upcase.gsub(/\s+/, ""),
          title:       display_title,
          description: text.strip.gsub(/\s+/, " ")[0..200],
          end_at:      parse_date_from_text(text)
        }
      end
    end

    coupons += extract_codes_from_text(doc.text) if coupons.empty?
    coupons.uniq { |c| [ c[:code], c[:title] ] }
  end

  private

  def format_title(title, discount)
    if title.present? && discount.present?
      "#{title} (Giảm #{discount})"
    elsif title.present?
      title
    elsif discount.present?
      "Giảm #{discount} tại #{label}"
    else
      "Mã giảm giá #{label}"
    end
  end
end
