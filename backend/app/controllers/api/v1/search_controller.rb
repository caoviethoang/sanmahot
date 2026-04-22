class Api::V1::SearchController < Api::V1::BaseController
  def index
    @q = Deal.active.ransack(params[:q])
    @deals = paginate(@q.result.order(created_at: :desc))
    render json: {
      deals: ActiveModelSerializers::SerializableResource.new(@deals, each_serializer: DealSerializer),
      pagination: pagination_dict(@deals)
    }
  end
end
