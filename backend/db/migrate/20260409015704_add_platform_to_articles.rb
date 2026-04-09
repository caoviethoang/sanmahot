class AddPlatformToArticles < ActiveRecord::Migration[8.1]
  def change
    add_column :articles, :platform, :string
    add_index :articles, :platform
  end
end
