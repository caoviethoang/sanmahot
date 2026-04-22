namespace :crawl do
  desc "Crawl latest promotional articles from magiamgia.com"
  task magiamgia: :environment do
    ArticleCrawlerService.new.crawl_all
    puts "All sections finished."
  end

  desc "Scrape public coupon codes from Lazada, Sendo, FPT Shop, Nguyenkim, Fahasa"
  task platform_coupons: :environment do
    Rails.logger = Logger.new(STDOUT)
    puts "[#{Time.current}] Bắt đầu scrape coupon từ các sàn thương mại điện tử..."
    total = PlatformCouponScraperService.new.run
    puts " Hoàn tất! Đã thêm/cập nhật #{total} coupon."
  end
end
