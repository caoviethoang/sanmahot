class DailyCrawlJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "--- [#{Time.current}] Bắt đầu quy trình Crawl định kỳ hàng ngày ---"

    # 1. Sync Coupons
    begin
      SyncCouponsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncCouponsJob: #{e.message}"
    end

    # 2. Sync Deals
    begin
      SyncDealsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncDealsJob: #{e.message}"
    end

    # 3. Sync Hot Coupons / Deals (API)
    begin
      SyncHotCouponsJob.perform_now
    rescue => e
      Rails.logger.error "Lỗi khi SyncHotCouponsJob: #{e.message}"
    end

    # 4. Scrape Hot Deal Calendar (Bot Trình Duyệt)
    begin
      Rails.logger.info "Bắt đầu chạy Bot cào lịch Hot Deal..."
      AtScraperService.new.scrape_calendar
    rescue => e
      Rails.logger.error "Lỗi khi chạy AtScraperService: #{e.message}"
    end

    # 5. Crawl Articles
    begin
      Rails.logger.info "Bắt đầu crawl bài viết từ ArticleCrawlerService..."
      ArticleCrawlerService.new.crawl_all
      Rails.logger.info "Hoàn tất crawl bài viết!"
    rescue => e
      Rails.logger.error "Lỗi khi ArticleCrawlerService: #{e.message}"
    end

    Rails.logger.info "--- [#{Time.current}] Hoàn tất quy trình Crawl định kỳ ---"
  end
end
