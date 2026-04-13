set :output, "log/cron.log"
set :environment, "development"

every 1.day, at: "0:00 am" do
  runner "DailyCrawlJob.perform_later"
end
