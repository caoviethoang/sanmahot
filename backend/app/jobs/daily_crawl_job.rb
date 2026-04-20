class DailyCrawlJob < ApplicationJob
  queue_as :default

  def perform
    msg = "--- [#{Time.current}] Bắt đầu quy trình Crawl định kỳ hàng ngày ---"
    Rails.logger.info msg
    puts msg

    # 1. Sync Coupons
    begin
      puts "1. Đang đồng bộ Coupons..."
      SyncCouponsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncCouponsJob: #{e.message}"
    end

    # 2. Sync Deals
    begin
      puts "2. Đang đồng bộ Deals..."
      SyncDealsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncDealsJob: #{e.message}"
    end

    # 3. Sync Hot Coupons / Deals (API)
    begin
      puts "3. Đang đồng bộ Hot Coupons (API)..."
      SyncHotCouponsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncHotCouponsJob: #{e.message}"
    end

    # 4. Scrape Hot Deal Calendar (Bot Trình Duyệt)
    begin
      puts "4. Đang chạy Bot cào lịch Hot Deal (Cái này có thể mất vài phút)..."
      AtScraperService.new.scrape_calendar
    rescue => e
      Rails.logger.error "Lỗi khi chạy AtScraperService: #{e.message}"
    end

    # 5. Crawl Articles
    begin
      puts "5. Đang crawl bài viết từ magiamgia.com..."
      ArticleCrawlerService.new.crawl_all
      puts "   Hoàn tất crawl bài viết!"
    rescue => e
      Rails.logger.error "Lỗi khi ArticleCrawlerService: #{e.message}"
    end

    msg_end = "--- [#{Time.current}] Hoàn tất quy trình Crawl định kỳ ---"
    Rails.logger.info msg_end
    puts msg_end
  end
end
