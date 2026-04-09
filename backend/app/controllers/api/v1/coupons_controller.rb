class Api::V1::CouponsController < Api::V1::BaseController
  def index
    @coupons = Coupon.active.order(created_at: :desc)
    @coupons = @coupons.where("LOWER(platform) = ?", params[:platform].downcase) if params[:platform].present?

    @coupons = paginate(@coupons)
    render json: {
      coupons: ActiveModelSerializers::SerializableResource.new(@coupons, each_serializer: CouponSerializer),
      pagination: pagination_dict(@coupons)
    }
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
