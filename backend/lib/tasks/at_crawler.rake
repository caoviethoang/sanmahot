namespace :at do
  desc "Scrape Hot Deal Calendar from pub2.accesstrade.vn"
  task scrape_calendar: :environment do
    Rails.logger = Logger.new(STDOUT)
    puts "Bắt đầu khởi động trình duyệt ảo để cào lịch AccessTrade..."
    AtScraperService.new.scrape_calendar
    puts "Xong!"
  end
end
