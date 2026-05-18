# frozen_string_literal: true

# DealQuery
#
# Encapsulates filtering and sorting for the Deal index endpoint.
# Keeps DealsController#index thin and makes query logic independently testable.
#
# Usage:
#   DealQuery.new(Deal.active, params).call
#
class DealQuery
  SORT_OPTIONS = {
    "discount"   => { discount_percent: :desc },
    "price_asc"  => { sale_price: :asc },
    "price_desc" => { sale_price: :desc }
  }.freeze
  DEFAULT_SORT = { created_at: :desc }.freeze

  def initialize(scope = Deal.active, params = {})
    @scope  = scope
    @params = params
  end

  def call
    filter_by_merchant
    filter_by_category
    filter_by_keyword
    filter_by_min_price
    filter_by_max_price
    apply_sort
    @scope
  end

  private

  def filter_by_merchant
    return unless @params[:merchant].present?

    @scope = @scope.where("LOWER(source_platform) = ?", @params[:merchant].downcase)
  end

  def filter_by_category
    return unless @params[:category_id].present?

    @scope = @scope.where(category_id: @params[:category_id])
  end

  def filter_by_keyword
    return unless @params[:q].present?

    @scope = @scope.where("LOWER(title) LIKE ?", "%#{@params[:q].downcase}%")
  end

  def filter_by_min_price
    return unless @params[:min_price].present?

    @scope = @scope.where("sale_price >= ?", @params[:min_price])
  end

  def filter_by_max_price
    return unless @params[:max_price].present?

    @scope = @scope.where("sale_price <= ?", @params[:max_price])
  end

  def apply_sort
    order = SORT_OPTIONS.fetch(@params[:sort], DEFAULT_SORT)
    @scope = @scope.order(order)
  end
end
