# frozen_string_literal: true

module Api
  module V1
    class ArticlesController < BaseController
      def index
        articles = ArticleQuery.new(Article.published, params).call
        articles = paginate(articles)

        render json: {
          articles:   ActiveModelSerializers::SerializableResource.new(articles),
          pagination: pagination_dict(articles)
        }
      end

      def show
        article = Article.friendly.find(params[:slug])

        if article.published? || article.published_at.present?
          render json: article
        else
          render json: { error: "Article not found" }, status: :not_found
        end
      end
    end
  end
end
