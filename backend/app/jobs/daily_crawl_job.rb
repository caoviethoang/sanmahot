class DailyCrawlJob < ApplicationJob
  queue_as :default

  def perform
    msg = "--- [#{Time.current}] Bắt đầu quy trình Crawl định kỳ hàng ngày ---"
    Rails.logger.info msg
    puts msg

    # 1. Sync Coupons
    run_step("Đồng bộ Coupons") { SyncCouponsJob.perform_now }

    # 2. Sync Deals
    run_step("Đồng bộ Deals") { SyncDealsJob.perform_now }

    # 3. Sync Hot Coupons / Deals (API)
    run_step("Đồng bộ Hot Coupons (API)") { SyncHotCouponsJob.perform_now }

    # 4. Scrape Hot Deal Calendar (Bot Trình Duyệt)
    run_step("Bot cào lịch Hot Deal") { AtScraperService.new.scrape_calendar }

    # 5. Crawl Articles
    run_step("Crawl bài viết từ magiamgia.com") { ArticleCrawlerService.new.crawl_all }

    # 6. Scrape Platform Coupons (Lazada, Sendo, FPT Shop, Nguyenkim, Fahasa...)
    run_step("Scrape coupon từ các sàn TMĐT") { PlatformCouponScraperService.new.run }

    msg_end = "--- [#{Time.current}] Hoàn tất quy trình Crawl định kỳ ---"
    Rails.logger.info msg_end
    puts msg_end
  end

  private

  def run_step(name)
    puts "🚀 Đang thực hiện: #{name}..."
    Rails.logger.info ">>> START STEP: #{name}"
    yield
    Rails.logger.info "<<< END STEP: #{name}"
  rescue StandardError => e
    error_msg = "❌ LỖI tại bước [#{name}]: #{e.message}"
    Rails.logger.error error_msg
    puts error_msg
  end
end
