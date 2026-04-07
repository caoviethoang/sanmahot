class Api::V1::Admin::DealsController < Api::V1::Admin::BaseController
  before_action :set_deal, only: [ :show, :update, :destroy ]

  def index
    @deals = Deal.all.order(created_at: :desc)
    render json: @deals
  end

  def show
    render json: @deal
  end

  def create
    @deal = Deal.new(deal_params)
    if @deal.save
      render json: @deal, status: :created
    else
      render json: { errors: @deal.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @deal.update(deal_params)
      render json: @deal
    else
      render json: { errors: @deal.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @deal.destroy
    head :no_content
  end

  private

  def set_deal
    @deal = Deal.friendly.find(params[:id])
  end

  def deal_params
    params.require(:deal).permit(
      :title, :description, :original_price, :sale_price,
      :discount_percent, :affiliate_url, :image_url,
      :merchant_name, :source_platform, :coupon_code,
      :status, :start_at, :expired_at, :category_id,
      tag_ids: []
    )
  end
end
