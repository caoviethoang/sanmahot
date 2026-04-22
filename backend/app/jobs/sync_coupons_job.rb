class SyncCouponsJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "[SyncCouponsJob] Bắt đầu đồng bộ Coupon từ AccessTrade..."
    AccesstradeService.new.sync_coupons
    Rails.logger.info "[SyncCouponsJob] Hoàn tất!"
  end
end
