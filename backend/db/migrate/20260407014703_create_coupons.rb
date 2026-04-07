class CreateCoupons < ActiveRecord::Migration[8.1]
  def change
    create_table :coupons do |t|
      t.string :title
      t.string :code
      t.string :slug
      t.text :description
      t.string :platform
      t.string :discount_type
      t.decimal :discount_value
      t.decimal :min_order_value
      t.string :affiliate_url
      t.datetime :start_at
      t.datetime :end_at
      t.integer :status

      t.timestamps
    end
    add_index :coupons, :slug
  end
end
