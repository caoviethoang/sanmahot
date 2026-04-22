class Coupon < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  enum :status, { draft: 0, active: 1, expired: 2 }, default: :draft

  validates :title, :code, :affiliate_url, presence: true
  validates :slug, uniqueness: true, allow_nil: true

  scope :active, -> { where(status: :active).where("end_at > ? OR end_at IS NULL", Time.current) }
end
