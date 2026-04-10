class Api::V1::DealsController < Api::V1::BaseController
  def index
    @deals = Deal.active

    @deals = @deals.where("LOWER(source_platform) = ?", params[:merchant].downcase) if params[:merchant].present?
    @deals = @deals.where(category_id: params[:category_id]) if params[:category_id].present?
    @deals = @deals.where("LOWER(title) LIKE ?", "%#{params[:q].downcase}%") if params[:q].present?
    @deals = @deals.where("sale_price >= ?", params[:min_price]) if params[:min_price].present?
    @deals = @deals.where("sale_price <= ?", params[:max_price]) if params[:max_price].present?

    @deals = case params[:sort]
    when "discount" then @deals.order(discount_percent: :desc)
    when "price_asc" then @deals.order(sale_price: :asc)
    when "price_desc" then @deals.order(sale_price: :desc)
    else @deals.order(created_at: :desc)
    end

    @deals = paginate(@deals)
    render json: {
      deals: ActiveModelSerializers::SerializableResource.new(@deals, each_serializer: DealSerializer),
      pagination: pagination_dict(@deals)
    }
  end

  def show
    @deal = Deal.active.friendly.find(params[:id])
    render json: @deal
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
