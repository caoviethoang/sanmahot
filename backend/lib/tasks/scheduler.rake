namespace :crawl do
  desc "Run all crawl and sync tasks via DailyCrawlJob"
  task all: :environment do
    puts ">>> Đang bắt đầu task crawl:all..."
    DailyCrawlJob.perform_now
  end

  desc "Alias for crawl:all"
  task daily: :environment do
    puts ">>> Đang gọi task crawl:daily..."
    Rake::Task["crawl:all"].invoke
  end
end
