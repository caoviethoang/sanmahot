class Article < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :slugged

  enum :status, { draft: 0, published: 1 }, default: :draft

  validates :title, :content, presence: true
  validates :slug, uniqueness: true, allow_nil: true

  scope :published, -> { where(status: :published).where("published_at <= ?", Time.current) }
end
