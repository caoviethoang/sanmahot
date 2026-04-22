class SyncDealsJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "[SyncDealsJob] Bắt đầu đồng bộ Deal từ AccessTrade..."
    AccesstradeService.new.sync_deals
    Rails.logger.info "[SyncDealsJob] Hoàn tất!"
  end
end
