class Api::V1::Admin::CouponsController < Api::V1::Admin::BaseController
  before_action :set_coupon, only: [:show, :update, :destroy]

  def index
    @coupons = Coupon.all.order(created_at: :desc)
    render json: @coupons
  end

  def show
    render json: @coupon
  end

  def create
    @coupon = Coupon.new(coupon_params)
    if @coupon.save
      render json: @coupon, status: :created
    else
      render json: { errors: @coupon.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @coupon.update(coupon_params)
      render json: @coupon
    else
      render json: { errors: @coupon.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @coupon.destroy
    head :no_content
  end

  private

  def set_coupon
    @coupon = Coupon.friendly.find(params[:id])
  end

  def coupon_params
    params.require(:coupon).permit(
      :title, :code, :description, :platform, 
      :discount_type, :discount_value, :min_order_value, 
      :affiliate_url, :start_at, :end_at, :status
    )
  end
end
