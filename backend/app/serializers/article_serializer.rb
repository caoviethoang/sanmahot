class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :slug, :content, :excerpt, :meta_title, :meta_description, :published_at, :status, :image_url, :category
end
