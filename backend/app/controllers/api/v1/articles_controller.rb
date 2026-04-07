class Api::V1::ArticlesController < Api::V1::BaseController
  def index
    @articles = paginate(Article.published.order(published_at: :desc))
    render json: @articles, each_serializer: ArticleSerializer, meta: pagination_dict(@articles)
  end

  def show
    @article = Article.published.friendly.find(params[:id])
    render json: @article
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
