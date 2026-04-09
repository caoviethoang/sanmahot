require 'nokogiri'

html = "<div class='content'><p>Tham khảo ngay tại link: https://shorten.asia/Hn449DXA</p></div>"
doc = Nokogiri::HTML::DocumentFragment.parse(html)
content_node = doc.at_css('.content')

url_regex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/

content_node.xpath('.//text()').each do |text_node|
  next if text_node.parent.name == 'a'
  if text_node.content =~ url_regex
    puts "Found match: #{text_node.content}"
    new_html = text_node.content.gsub(url_regex) do |match|
      "<a href='#{match}' target='_blank' rel='nofollow' style='color: #2563eb; font-weight: bold; text-decoration: underline;'>#{match}</a>"
    end
    text_node.replace(new_html)
  end
end

puts "Result: #{content_node.inner_html}"
