namespace :accesstrade do
  desc "Sync deals and coupons from AccessTrade API"
  task sync_offers: :environment do
    puts "🚀 [#{Time.current}] Starting AccessTrade -> Deals/Coupons Sync..."

    # 1. Fetch Offers
    at_service = AccessTradeService.new
    offers = at_service.fetch_latest_offers(limit: 50)

    if offers.empty?
      puts "⚠️ No offers found."
      return
    end

    # 2. Process each offer
    offers.each do |offer|
      if offer[:coupons].any?
        # Save as Coupon
        coupon = Coupon.find_or_initialize_by(slug: "coupon-at-#{Digest::MD5.hexdigest(offer[:link])[0..8]}")
        coupon.assign_attributes(
          title: offer[:name],
          affiliate_url: offer[:link],
          code: offer[:coupons].first,
          description: offer[:content],
          platform: offer[:merchant],
          category: offer[:category],
          status: :active,
          start_at: Time.current
        )
        coupon.save
        puts "  🎟️ Coupon: #{offer[:name]}"
      else
        # Save as Deal
        deal = Deal.find_or_initialize_by(slug: "deal-at-#{Digest::MD5.hexdigest(offer[:link])[0..8]}")
        # Need a category_id for Deal. Choosing first available or general.
        category = Category.find_by(name: offer[:category]) || Category.first || Category.create(name: "Khuyến mãi")

        deal.assign_attributes(
          title: offer[:name],
          affiliate_url: offer[:link],
          image_url: offer[:image],
          description: offer[:content],
          merchant_name: offer[:merchant],
          source_platform: offer[:merchant],
          category_id: category.id,
          status: :active,
          start_at: Time.current
        )
        deal.save
        puts "  🏷️ Deal: #{offer[:name]}"
      end
    end
    puts "✨ Sync finished!"
  end
end
