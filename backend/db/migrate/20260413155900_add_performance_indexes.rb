class AddPerformanceIndexes < ActiveRecord::Migration[7.1]
  def change
    # Functional indexes for case-insensitive exact searches used in controllers
    add_index :articles, "(lower(platform))", name: "idx_articles_lower_platform"
    add_index :articles, "(lower(category))", name: "idx_articles_lower_category"

    add_index :articles, :status
    add_index :articles, :published_at

    add_index :coupons, "(lower(platform))", name: "idx_coupons_lower_platform"
    add_index :coupons, "(lower(category))", name: "idx_coupons_lower_category"
    add_index :coupons, :status
    add_index :coupons, :end_at
    add_index :coupons, :created_at

    add_index :deals, "(lower(source_platform))", name: "idx_deals_lower_source_platform"
    add_index :deals, :status
    add_index :deals, :sale_price
    add_index :deals, :discount_percent
  end
end
