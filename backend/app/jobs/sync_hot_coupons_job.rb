class SyncHotCouponsJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "[SyncHotCouponsJob] Bắt đầu đồng bộ Hot Coupons/Deals từ AccessTrade..."
    # Gọi sync_hot_coupons: max_pages = 5, date_filter = 1 (1 tuần)
    AccesstradeService.new.sync_hot_coupons(5, 1)
    Rails.logger.info "[SyncHotCouponsJob] Hoàn tất!"
  end
end
