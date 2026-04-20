set :output, "log/cron.log"

case Rails.env
when 'production'
  every 1.day, at: "0:00 am" do
    rake "crawl:daily"
  end
when 'development'
  every 1.day, at: "0:00 am" do
    runner "DailyCrawlJob.perform_later"
  end
end
