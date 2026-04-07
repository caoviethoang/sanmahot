class CreateDeals < ActiveRecord::Migration[8.1]
  def change
    create_table :deals do |t|
      t.string :title
      t.string :slug
      t.text :description
      t.decimal :original_price
      t.decimal :sale_price
      t.integer :discount_percent
      t.string :affiliate_url
      t.string :image_url
      t.string :merchant_name
      t.string :source_platform
      t.string :coupon_code
      t.integer :status
      t.datetime :start_at
      t.datetime :expired_at
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
    add_index :deals, :slug
  end
end
