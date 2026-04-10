class SyncDealsJob < ApplicationJob
  queue_as :default

  def perform(*args)
    Rails.logger.info "Bắt đầu đồng bộ Deal từ AccessTrade..."
    AccesstradeService.new.sync_deals
    Rails.logger.info "Đồng bộ hoàn tất!"
  end
end
