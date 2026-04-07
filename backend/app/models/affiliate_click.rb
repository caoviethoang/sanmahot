class AffiliateClick < ApplicationRecord
  belongs_to :trackable, polymorphic: true

  validates :user_agent, presence: true
  validates :ip_address, presence: true
end
