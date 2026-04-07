class Api::V1::CouponsController < Api::V1::BaseController
  def index
    @coupons = paginate(Coupon.active.order(created_at: :desc))
    render json: @coupons, each_serializer: CouponSerializer, meta: pagination_dict(@coupons)
  end

  private

  def pagination_dict(object)
    {
      current_page: object.current_page,
      next_page: object.next_page,
      prev_page: object.prev_page,
      total_pages: object.total_pages,
      total_count: object.total_count
    }
  end
end
