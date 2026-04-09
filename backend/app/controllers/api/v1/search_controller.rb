class Api::V1::SearchController < Api::V1::BaseController
  def index
    @q = Deal.active.ransack(params[:q])
    @deals = paginate(@q.result.order(created_at: :desc))
    render json: {
      deals: ActiveModelSerializers::SerializableResource.new(@deals, each_serializer: DealSerializer),
      pagination: pagination_dict(@deals)
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
