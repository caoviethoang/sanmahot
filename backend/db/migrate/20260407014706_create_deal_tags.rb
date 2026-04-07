class CreateDealTags < ActiveRecord::Migration[8.1]
  def change
    create_table :deal_tags do |t|
      t.references :deal, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
