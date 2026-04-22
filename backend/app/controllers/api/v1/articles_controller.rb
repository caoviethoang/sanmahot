module Api
  module V1
    class ArticlesController < BaseController
      def index
        @articles = Article.published
        @articles = @articles.where(category: params[:category]) if params[:category].present?
        @articles = @articles.where(platform: params[:platform]) if params[:platform].present?
        @articles = @articles.order(published_at: :desc, id: :desc)
        @articles = paginate(@articles)

        render json: {
          articles:   ActiveModelSerializers::SerializableResource.new(@articles),
          pagination: pagination_dict(@articles)
        }
      end

      def show
        @article = Article.friendly.find(params[:slug])
        if @article.published? || @article.published_at.present?
          render json: @article
        else
          render json: { error: "Article not found" }, status: :not_found
        end
      end
    end
  end
end
