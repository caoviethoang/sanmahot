class Api::V1::Admin::BaseController < ApplicationController
  before_action :authenticate_admin!

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def not_found
    render json: { error: "Not found" }, status: :not_found
  end
end
