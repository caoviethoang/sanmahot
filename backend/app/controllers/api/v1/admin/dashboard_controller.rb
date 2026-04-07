class Api::V1::Admin::DashboardController < Api::V1::Admin::BaseController
  def stats
    render json: {
      deals_count: Deal.count,
      active_deals_count: Deal.active.count,
      coupons_count: Coupon.count,
      active_coupons_count: Coupon.active.count,
      articles_count: Article.count,
      categories_count: Category.count
    }
  end
end
