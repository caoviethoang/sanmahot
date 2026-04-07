class AddDetailsToCoupons < ActiveRecord::Migration[8.1]
  def change
    add_column :coupons, :category, :string
    add_column :coupons, :terms, :text
    add_column :coupons, :target_users, :string
  end
end
