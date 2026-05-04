# frozen_string_literal: true

module Api
  module V1
    class CouponsController < BaseController
      def index
        coupons = CouponQuery.new(Coupon.active, params).call
        coupons = paginate(coupons)

        render json: {
          coupons:    ActiveModelSerializers::SerializableResource.new(coupons, each_serializer: CouponSerializer),
          pagination: pagination_dict(coupons)
        }
      end

      def categories
        cats = Coupon.active.distinct.pluck(:category).compact.sort
        render json: cats
      end
    end
  end
end
