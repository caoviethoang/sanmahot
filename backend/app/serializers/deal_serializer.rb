class DealSerializer < ActiveModel::Serializer
  attributes :id, :title, :slug, :description, :original_price, :sale_price, :discount_percent, :affiliate_url, :image_url, :merchant_name, :source_platform, :coupon_code, :status, :start_at, :expired_at, :category_id
end
