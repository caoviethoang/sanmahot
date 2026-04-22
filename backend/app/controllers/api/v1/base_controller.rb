class Api::V1::BaseController < ApplicationController
  private

  def paginate(scope)
    scope.page(params[:page] || 1).per(params[:per_page] || 25)
  end

  def pagination_dict(object)
    {
      current_page: object.current_page,
      next_page:    object.next_page,
      prev_page:    object.prev_page,
      total_pages:  object.total_pages,
      total_count:  object.total_count
    }
  end
end
