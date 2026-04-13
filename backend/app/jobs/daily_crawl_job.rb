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

    # 3. Crawl Articles
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
