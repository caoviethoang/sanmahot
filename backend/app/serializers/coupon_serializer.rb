class CouponSerializer < ActiveModel::Serializer
  attributes :id, :title, :code, :slug, :description, :platform, :discount_type, :discount_value, :min_order_value, :affiliate_url, :start_at, :end_at, :status, :category, :terms, :target_users
end
