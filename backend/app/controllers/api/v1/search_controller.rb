# frozen_string_literal: true

module Api
  module V1
    class SearchController < BaseController
      def index
        q     = Deal.active.ransack(params[:q])
        deals = paginate(q.result.order(created_at: :desc))

        render json: {
          deals:      ActiveModelSerializers::SerializableResource.new(deals, each_serializer: DealSerializer),
          pagination: pagination_dict(deals)
        }
      end
    end
  end
end
