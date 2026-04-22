class Api::V1::CouponsController < Api::V1::BaseController
  def index
    @coupons = Coupon.active.order(created_at: :desc)
    @coupons = @coupons.where("LOWER(platform) = ?", params[:platform].downcase) if params[:platform].present?
    @coupons = @coupons.where("LOWER(category) = ?", params[:category].downcase) if params[:category].present?
    @coupons = @coupons.where("LOWER(title) LIKE ?", "%#{params[:q].downcase}%") if params[:q].present?

    @coupons = case params[:sort]
    when "newest" then @coupons.reorder(created_at: :desc)
    when "expiring" then @coupons.reorder(end_at: :asc)
    else @coupons
    end

    @coupons = paginate(@coupons)
    render json: {
      coupons:    ActiveModelSerializers::SerializableResource.new(@coupons, each_serializer: CouponSerializer),
      pagination: pagination_dict(@coupons)
    }
  end

  def categories
    cats = Coupon.active.distinct.pluck(:category).compact.sort
    render json: cats
  end
end
