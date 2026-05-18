# frozen_string_literal: true

module Api
  module V1
    class DealsController < BaseController
      def index
        deals = DealQuery.new(Deal.active, params).call
        deals = paginate(deals)

        render json: {
          deals:      ActiveModelSerializers::SerializableResource.new(deals, each_serializer: DealSerializer),
          pagination: pagination_dict(deals)
        }
      end

      def show
        deal = Deal.active.friendly.find(params[:id])
        render json: deal
      end
    end
  end
end
