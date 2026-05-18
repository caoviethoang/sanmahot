# frozen_string_literal: true

# ArticleQuery
#
# Encapsulates filtering for the Article index endpoint.
#
# Usage:
#   ArticleQuery.new(Article.published, params).call
#
class ArticleQuery
  def initialize(scope = Article.published, params = {})
    @scope  = scope
    @params = params
  end

  def call
    filter_by_category
    filter_by_platform
    apply_default_sort
    @scope
  end

  private

  def filter_by_category
    return unless @params[:category].present?

    @scope = @scope.where(category: @params[:category])
  end

  def filter_by_platform
    return unless @params[:platform].present?

    @scope = @scope.where(platform: @params[:platform])
  end

  def apply_default_sort
    @scope = @scope.order(published_at: :desc, id: :desc)
  end
end
