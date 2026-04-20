module Api
  module V1
    class RedirectsController < BaseController
      def deal
        @deal = Deal.friendly.find(params[:id])
        track_click(@deal)
        redirect_to safe_url(@deal.affiliate_url), allow_other_host: true
      end

      def coupon
        @coupon = Coupon.friendly.find(params[:id])
        track_click(@coupon)
        redirect_to safe_url(@coupon.affiliate_url), allow_other_host: true
      end

      private

      def safe_url(url)
        return root_url if url.blank?

        # Chỉ cho phép chuyển hướng nếu là URL hợp lệ (http/https)
        # Điều này giúp ngăn chặn các cuộc tấn công XSS hoặc Phishing qua URL lạ
        url.to_s.start_with?("http://", "https://") ? url : root_url
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
