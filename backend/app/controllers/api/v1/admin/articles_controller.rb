class Api::V1::Admin::ArticlesController < Api::V1::Admin::BaseController
  before_action :set_article, only: [ :show, :update, :destroy ]

  def index
    @articles = Article.all.order(created_at: :desc)
    render json: @articles
  end

  def show
    render json: @article
  end

  def create
    @article = Article.new(article_params)
    if @article.save
      render json: @article, status: :created
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @article.update(article_params)
      render json: @article
    else
      render json: { errors: @article.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @article.destroy
    head :no_content
  end

  private

  def set_article
    @article = Article.friendly.find(params[:id])
  end

  def article_params
    params.require(:article).permit(
      :title, :content, :excerpt, :meta_title,
      :meta_description, :published_at, :status
    )
  end
end
