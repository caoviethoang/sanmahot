class Scrapers::GenericScraper < Scrapers::BaseScraper
  def parse
    doc = Nokogiri::HTML(browser.body)
    extract_codes_from_text(doc.text)
  end
end
