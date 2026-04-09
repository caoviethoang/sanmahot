require 'nokogiri'
require 'open-uri'

headers = { "User-Agent" => "Mozilla/5.0" }
url = 'https://magiamgia.com/ma-giam-gia-long-chau/'
doc = Nokogiri::HTML(URI.open(url, headers))

puts "entry-content: #{doc.css('.entry-content').length}"
puts "post-content:  #{doc.css('.post-content').length}"
puts "article:       #{doc.css('article').length}"
puts "main:          #{doc.css('main').length}"
puts "elementor-post__content: #{doc.css('.elementor-post__content').length}"
puts "elementor-widget-theme-post-content: #{doc.css('.elementor-widget-theme-post-content').length}"

largest = doc.css('div').max_by { |div| div.text.length }
if largest
  puts "Largest div id: #{largest['id']}"
  puts "Largest div classes: #{largest['class']}"

  # Check if there is an explicit content wrap
  puts "content_classes: #{doc.css('[class*="content"]').map { |c| c['class'] }.uniq.join(', ')}"
end
