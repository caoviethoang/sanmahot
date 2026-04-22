class Deal < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  belongs_to :category
  has_many :deal_tags, dependent: :destroy
  has_many :tags, through: :deal_tags

  enum :status, { draft: 0, active: 1, expired: 2 }, default: :draft

  validates :title, :affiliate_url, presence: true
  validates :slug, uniqueness: true, allow_nil: true

  scope :active, -> { where(status: :active).where("expired_at > ? OR expired_at IS NULL", Time.current) }
  scope :hot, -> { active.order(discount_percent: :desc) }
end
