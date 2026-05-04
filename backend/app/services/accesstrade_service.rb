# frozen_string_literal: true

require "net/http"
require "json"

class AccesstradeService
  def initialize
    @client = Accesstrade::Client.new
  end

  def sync_coupons(max_pages = 100)
    sync_paged_data("/offers_informations", { status: 1 }, max_pages: max_pages) do |offers|
      process_coupons(offers)
    end
  end

  def sync_deals(max_pages = 100)
    sync_paged_data("/offers_informations", { status: 1 }, max_pages: max_pages) do |offers|
      process_deals(offers)
    end
  end

  def sync_hot_coupons(max_pages = 10, date_filter = 1)
    sync_paged_data("/offers_informations/coupon_hot", { date: date_filter }, max_pages: max_pages) do |offers|
      process_coupons(offers, is_hot: true)
    end
  end

  def sync_campaigns
    total_saved = 0
    @client.fetch_paged("/campaigns", { scope: "mine" }, max_pages: 10) do |data|
      data.each do |offer|
        merchant = offer["name"]
        category = Category.find_or_create_by!(name: "Ưu đãi")

        deal = Deal.find_or_initialize_by(source_platform: "Accesstrade", merchant_name: merchant)
        deal.assign_attributes(
          title:         merchant,
          affiliate_url: offer["aff_link"] || offer["link"],
          category:      category,
          status:        :active,
          description:   "Chiến dịch Affiliate #{merchant} từ AccessTrade"
        )
        total_saved += 1 if deal.save
      end
    end
    total_saved
  end

  def generate_deeplink(url)
    return url if url.blank?

    res        = @client.post("/product_links", { urls: [ url ] })
    items      = res["data"] || res["success_link"] || []
    first_item = items.is_a?(Array) ? items.first : items

    return url unless first_item.is_a?(Hash)

    first_item["short_link"] || first_item["success_link"] || first_item["product_link"] || url
  rescue Accesstrade::Client::Error => e
    Rails.logger.error("Error generating deeplink for #{url}: #{e.message}")
    url
  end

  private

  def sync_paged_data(path, params, max_pages:)
    type_name   = path.include?("hot") ? "Hot Coupon/Deal" : "Data"
    total_saved = 0

    @client.fetch_paged(path, params, max_pages: max_pages) do |offers, page|
      Rails.logger.info "Đang crawl AccessTrade #{type_name} trang #{page}..."
      total_saved += yield(offers)
    end

    Rails.logger.info "HOÀN TẤT: Tổng cộng đã đồng bộ thành công #{total_saved} #{type_name} mới/cập nhật."
    total_saved
  end

  def process_coupons(offers_data, is_hot: false)
    saved_count = 0
    offers_data.each do |item|
      next unless item["coupons"].is_a?(Array)

      item["coupons"].each do |c_item|
        code = c_item["coupon_code"] || c_item["code"]
        next if code.blank?

        attrs  = Accesstrade::Parser.parse_coupon_attributes(item, c_item, is_hot: is_hot)
        coupon = Coupon.find_or_initialize_by(code: code, platform: attrs[:platform])
        coupon.assign_attributes(attrs)

        next if expired?(coupon.end_at)

        saved_count += 1 if coupon.save
      end
    end
    saved_count
  end

  def process_deals(offers_data)
    saved_count = 0
    offers_data.each do |item|
      attrs    = Accesstrade::Parser.parse_deal_attributes(item)
      category = Category.find_or_create_by!(name: attrs.delete(:category_name))

      deal = Deal.find_or_initialize_by(affiliate_url: attrs[:affiliate_url])
      deal.assign_attributes(attrs.merge(category: category))

      next if expired?(deal.expired_at)

      saved_count += 1 if deal.save
    end
    saved_count
  end

  # Returns true when a timestamp is set and already in the past.
  def expired?(timestamp)
    return false if timestamp.blank?

    Time.zone.parse(timestamp.to_s) < Time.current
  rescue ArgumentError
    false
  end
end
