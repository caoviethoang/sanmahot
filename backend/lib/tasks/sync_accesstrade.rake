namespace :accesstrade do
  desc "Sync deals and coupons from AccessTrade API"
  task sync_offers: :environment do
    puts "[#{Time.current}] Starting AccessTrade -> Deals/Coupons Sync..."

    at_service = AccesstradeService.new

    puts "Syncing Coupons..."
    at_service.sync_coupons(5)

    puts "Syncing Deals..."
    at_service.sync_deals(5)

    puts "✨ Sync finished!"
  end
end
