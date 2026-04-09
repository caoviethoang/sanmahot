module Api
  module V1
    class ArticlesController < ApplicationController
      def index
        @articles = Article.published
        @articles = @articles.where(category: params[:category]) if params[:category].present?
        @articles = @articles.where(platform: params[:platform]) if params[:platform].present?
        @articles = @articles.order(published_at: :desc, id: :desc).page(params[:page]).per(params[:per_page] || 12)

        render json: {
          articles: ActiveModelSerializers::SerializableResource.new(@articles),
          pagination: {
            current_page: @articles.current_page,
            next_page: @articles.next_page,
            prev_page: @articles.prev_page,
            total_pages: @articles.total_pages,
            total_count: @articles.total_count
          }
        }
      end

      def show
        @article = Article.friendly.find(params[:slug])
        if @article.published? || @article.published_at.nil? == false
          render json: @article
        else
          render json: { error: "Article not found" }, status: :not_found
        end
      end
    end
  end
end
