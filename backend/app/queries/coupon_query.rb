# frozen_string_literal: true

# CouponQuery
#
# Encapsulates filtering and sorting for the Coupon index endpoint.
#
# Usage:
#   CouponQuery.new(Coupon.active, params).call
#
class CouponQuery
  SORT_OPTIONS = {
    "newest"   => { created_at: :desc },
    "expiring" => { end_at: :asc }
  }.freeze
  DEFAULT_SORT = { created_at: :desc }.freeze

  def initialize(scope = Coupon.active, params = {})
    @scope  = scope
    @params = params
  end

  def call
    filter_by_platform
    filter_by_category
    filter_by_keyword
    apply_sort
    @scope
  end

  private

  def filter_by_platform
    return unless @params[:platform].present?

    @scope = @scope.where("LOWER(platform) = ?", @params[:platform].downcase)
  end

  def filter_by_category
    return unless @params[:category].present?

    @scope = @scope.where("LOWER(category) = ?", @params[:category].downcase)
  end

  def filter_by_keyword
    return unless @params[:q].present?

    @scope = @scope.where("LOWER(title) LIKE ?", "%#{@params[:q].downcase}%")
  end

  def apply_sort
    order = SORT_OPTIONS.fetch(@params[:sort], DEFAULT_SORT)
    @scope = @scope.reorder(order)
  end
end
