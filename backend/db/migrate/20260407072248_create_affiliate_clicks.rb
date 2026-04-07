class CreateAffiliateClicks < ActiveRecord::Migration[8.1]
  def change
    create_table :affiliate_clicks do |t|
      t.references :trackable, polymorphic: true, null: false
      t.string :user_agent
      t.string :ip_address
      t.string :referrer

      t.timestamps
    end
  end
end
