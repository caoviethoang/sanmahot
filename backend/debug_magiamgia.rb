require 'nokogiri'
require 'open-uri'

headers = { "User-Agent" => "Mozilla/5.0" }
url = 'https://magiamgia.com/ma-giam-gia-long-chau/'
doc = Nokogiri::HTML(URI.open(url, headers))

# Common WP featured image locations
img = doc.css('.featured-image img').first || doc.css('.entry-content img').first || doc.css('meta[property="og:image"]').first
puts "Image URL found: #{img['src'] || img['content']}"

# Check categories
cats = doc.css('.entry-meta .cat-links a').map(&:text)
puts "Categories: #{cats.inspect}"
