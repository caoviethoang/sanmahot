class Tag < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :deal_tags, dependent: :destroy
  has_many :deals, through: :deal_tags

  validates :name, :slug, presence: true, uniqueness: true
end
