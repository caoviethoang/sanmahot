require 'nokogiri'
require 'open-uri'

headers = { "User-Agent" => "Mozilla/5.0" }
url = 'https://magiamgia.com/ma-giam-gia-long-chau/'
doc = Nokogiri::HTML(URI.open(url, headers))

# Print all image tags to see what's available
puts "--- All Images ---"
doc.css('img').each do |img|
  puts "src: #{img['src']} | alt: #{img['alt']} | id: #{img['id']} | class: #{img['class']}"
end

puts "\n--- Meta Images ---"
puts doc.css('meta[property="og:image"]').first&.[]('content')
puts doc.css('meta[name="twitter:image"]').first&.[]('content')
