namespace :crawl do
  desc "Run all crawl and sync tasks (Manual trigger)"
  task all: :environment do
    puts "Bắt đầu quy trình Crawl toàn bộ hệ thống..."

    puts "\n--- Bước 1: Đồng bộ Coupon ---"
    SyncCouponsJob.perform_now

    puts "\n--- Bước 2: Đồng bộ Deals ---"
    SyncDealsJob.perform_now

    puts "\n--- Bước 3: Crawl Bài viết ---"
    ArticleCrawlerService.new.crawl_all

    puts "\n Quy trình Crawl toàn bộ đã hoàn thành!"
  end
end
