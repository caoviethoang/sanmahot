class CreateArticles < ActiveRecord::Migration[8.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.string :slug
      t.text :content
      t.text :excerpt
      t.string :meta_title
      t.string :meta_description
      t.datetime :published_at
      t.integer :status

      t.timestamps
    end
    add_index :articles, :slug
  end
end
