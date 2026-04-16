# backend/lib/scripts/sync_campaigns_browser.rb
require "ferrum"

browser = Ferrum::Browser.new(
  window_size: [ 1366, 768 ],
  browser_options: { "no-sandbox" => nil, "disable-setuid-sandbox" => nil }
)

def login(browser)
  puts "Logging in..."
  browser.goto("https://pub2.accesstrade.vn/login")
  sleep 5
  browser.at_css("input[name='email']").focus.type(ENV["ACCESSTRADE_EMAIL"])
  browser.at_css("input[name='password']").focus.type(ENV["ACCESSTRADE_PASSWORD"])
  browser.at_css("button[type='submit']").click
  sleep 10
end

begin
  login(browser)

  puts "Navigating to Active Campaigns..."
  browser.goto("https://pub2.accesstrade.vn/campaign/all?approval=successful")
  sleep 10

  # Get campaign elements
  campaigns = browser.css(".campaign-item, .card-campaign, tr") # Need to check actual selector
  puts "Found #{campaigns.size} campaigns on page 1."

  # For now, let's just get the first few to test
  campaigns.each do |c|
    name = c.at_css(".campaign-name, .name, h6")&.text&.strip
    # Link "Lấy link"
    link_btn = c.at_css("a[href*='deeplink'], a[href*='shorten'], button.btn-primary")

    if name && link_btn
      puts "Syncing: #{name}"
      # Click to get link if needed, or just grab href
      href = link_btn.attribute("href")
      # ... logic to save to Deal model
    end
  end

ensure
  browser.quit
end
