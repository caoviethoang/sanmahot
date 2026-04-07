module Api
  module V1
    class RedirectsController < BaseController
      skip_before_action :authenticate_admin!

      def deal
        @deal = Deal.friendly.find(params[:id])
        track_click(@deal)
        redirect_to @deal.affiliate_url, allow_other_host: true
      end

      def coupon
        @coupon = Coupon.friendly.find(params[:id])
        track_click(@coupon)
        redirect_to @coupon.affiliate_url, allow_other_host: true
      end

      private

      def track_click(trackable)
        AffiliateClick.create!(
          trackable: trackable,
          user_agent: request.user_agent,
          ip_address: request.remote_ip,
          referrer: request.referer
        )
      rescue StandardError => e
        Rails.logger.error "Failed to track affiliate click: #{e.message}"
      end
    end
  end
end
