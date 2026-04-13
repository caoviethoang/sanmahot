namespace :crawl do
  desc "Crawl latest promotional articles from magiamgia.com"
  task magiamgia: :environment do
    ArticleCrawlerService.new.crawl_all
    puts "✨ All sections finished."
  end
end
