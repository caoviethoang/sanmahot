class AddIsHotToCouponsAndDeals < ActiveRecord::Migration[8.1]
  def change
    add_column :coupons, :is_hot, :boolean, default: false
    add_column :deals, :is_hot, :boolean, default: false

    add_index :coupons, :is_hot
    add_index :deals, :is_hot
  end
end
