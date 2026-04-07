# Create an Admin
Admin.create!(email: 'admin@sanmahot.com', password: 'password123', password_confirmation: 'password123')

# Create Categories
categories = [ 'Electronics', 'Home & Kitchen', 'Beauty', 'Fashion', 'Toys' ].map do |name|
  Category.find_or_create_by!(name: name) do |c|
    c.description = "Best deals for #{name}"
  end
end

# Create Tags
tags = [ 'Hot Deal', 'Limited Offer', 'Freeship', 'Flash Sale' ].map do |name|
  Tag.find_or_create_by!(name: name)
end

# Create Deals
20.times do
  category = categories.sample
  original_price = rand(500..5000) * 1000
  discount = rand(10..70)
  sale_price = original_price * (100 - discount) / 100

  deal = Deal.create!(
    title: Faker::Commerce.product_name,
    description: Faker::Lorem.paragraph(sentence_count: 3),
    original_price: original_price,
    sale_price: sale_price,
    discount_percent: discount,
    affiliate_url: 'https://shope.ee/example',
    image_url: "https://picsum.photos/seed/#{rand(1000)}/400/300",
    merchant_name: [ 'Shopee', 'Lazada', 'TikTok Shop' ].sample,
    source_platform: [ 'Shopee', 'Lazada' ].sample,
    status: :active,
    start_at: Time.current,
    expired_at: 1.week.from_now,
    category: category
  )
  deal.tags << tags.sample(rand(1..3))
end

# Create Coupons
10.times do
  Coupon.create!(
    title: "Mã giảm giá #{rand(10..50)}k cho đơn từ #{rand(50..200)}k",
    code: "SANMAHOT#{rand(100..999)}",
    description: "Giảm trực tiếp vào đơn hàng Shopee",
    platform: 'Shopee',
    discount_type: 'amount',
    discount_value: [ 10000, 20000, 50000 ].sample,
    min_order_value: [ 0, 50000, 100000, 200000 ].sample,
    affiliate_url: 'https://shope.ee/coupon-example',
    status: :active,
    start_at: Time.current,
    end_at: 3.days.from_now
  )
end

# Create Articles
5.times do
  Article.create!(
    title: "Top 10 Deal #{Faker::Commerce.department} Ngon Nhất Hôm Nay",
    content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
    excerpt: "Tổng hợp các deal hời nhất ngày hôm nay cho các tín đồ săn sale.",
    status: :published,
    published_at: Time.current
  )
end

puts "Seed completed!"
