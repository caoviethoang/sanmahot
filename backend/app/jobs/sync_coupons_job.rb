class SyncCouponsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Rails.logger.info "Bắt đầu đồng bộ Coupon từ AccessTrade..."
    AccesstradeService.new.sync_coupons
    Rails.logger.info "Đồng bộ hoàn tất!"
  end
end
