require "ferrum"
require "nokogiri"

# PlatformCouponScraperService
#
# Scrapes public coupon/voucher pages of Vietnamese e-commerce platforms.
# Uses Ferrum (Headless Browser) to bypass bot protection and render JavaScript.
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
    { platform: "lazada",      label: "Lazada",        url: "https://www.lazada.vn/shop/coupon-center/", scraper_class: Scrapers::LazadaScraper },
    { platform: "sendo",       label: "Sendo",         url: "https://www.sendo.vn/khuyen-mai/",          scraper_class: Scrapers::SendoScraper },
    { platform: "fptshop",     label: "FPT Shop",      url: "https://fptshop.com.vn/uu-dai",             scraper_class: Scrapers::FptshopScraper },
    { platform: "nguyenkim",   label: "Nguyenkim",     url: "https://www.nguyenkim.com/khuyen-mai/",     scraper_class: Scrapers::NguyenkimScraper },
    { platform: "fahasa",      label: "Fahasa",        url: "https://www.fahasa.com/khuyen-mai.html",    scraper_class: Scrapers::FahasaScraper },
    { platform: "dienmayxanh", label: "Điện Máy Xanh", url: "https://www.dienmayxanh.com/khuyen-mai",    scraper_class: Scrapers::GenericScraper },
    { platform: "grab",        label: "Grab",          url: "https://www.grab.com/vn/khuyen-mai/",       scraper_class: Scrapers::GenericScraper },
    { platform: "vnpay",       label: "VNPAY",         url: "https://vnpay.vn/tin-khuyen-mai",           scraper_class: Scrapers::GenericScraper },
    { platform: "xanhsm",      label: "XanhSM",        url: "https://www.xanhsm.com/khuyen-mai/",        scraper_class: Scrapers::GenericScraper }
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
          browser.goto(target[:url])
          sleep 5 # Allow for JS rendering

          scraper = target[:scraper_class].new(browser, target[:platform], target[:label])
          saved = scraper.run

          total += saved
        rescue => e
          Rails.logger.error "❌ Scraper Error: #{target[:label]} - #{e.message}"
        end
      end
    ensure
      browser.quit
    end

    Rails.logger.info "🏁 Scraper: Completed. Total coupons: #{total}"
    total
  end
end
