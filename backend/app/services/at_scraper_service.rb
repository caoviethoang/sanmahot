require "ferrum"
require "nokogiri"

class AtScraperService
  def initialize
    @username = ENV["ACCESSTRADE_EMAIL"]
    @password = ENV["ACCESSTRADE_PASSWORD"]
    @options = {
      window_size: [ 1366, 768 ],
      browser_options: {
        "no-sandbox": nil,
        "disable-dev-shm-usage": nil,
        "disable-gpu": nil
      },
      timeout: 60
    }
    @options[:browser_path] = "/usr/bin/chromium" if File.exist?("/usr/bin/chromium")
  end

  def scrape_calendar
    return unless validate_credentials

    browser = Ferrum::Browser.new(@options)
    begin
      login(browser)

      Rails.logger.info "Truy cập Hot Deal: https://pub2.accesstrade.vn/tool/hot_deal"
      browser.goto("https://pub2.accesstrade.vn/tool/hot_deal")

      # Tăng thời gian chờ cho Angular render lịch
      sleep 20

      dismiss_popups(browser)

      badge_count = browser.css(".calendar-badge").size
      Rails.logger.info "Tìm thấy #{badge_count} sự kiện trên lịch."

      process_badges(browser, badge_count)

    rescue => e
      Rails.logger.error "LỖI SCRAPER: #{e.message}"
    ensure
      browser.quit
    end
  end

  private

  def validate_credentials
    if @username.blank? || @password.blank?
      Rails.logger.error "Thiếu thông tin đăng nhập trong .env"
      return false
    end
    true
  end

  def login(browser)
    Rails.logger.info "Đang đăng nhập AccessTrade..."
    browser.goto("https://id.accesstrade.vn/login")
    sleep 5

    user_input = browser.at_css("#username") || browser.at_css("input[name='username']")
    pass_input = browser.at_css("#password") || browser.at_css("input[name='password']")

    if user_input && pass_input
      user_input.focus.type(@username)
      pass_input.focus.type(@password)
      browser.at_css("button[type='submit']").click
      sleep 8
    else
      Rails.logger.error "Không tìm thấy form login"
    end
  end

  def dismiss_popups(browser)
    begin
      browser.at_xpath("//button[contains(text(), 'Chấp nhận')]")&.click
      sleep 1
    rescue
    end
  end

  def process_badges(browser, count)
    category = Category.find_by(id: 6) || Category.find_by(name: "Ưu đãi") || Category.first

    (0...count).each do |index|
      begin
        # Lấy lại danh sách ngày/badges
        badges = browser.css(".calendar-badge")
        badge = badges[index]
        next unless badge

        # Click để mở row (event-action)
        badge.click
        sleep 2

        # Tìm các sự kiện con trong row
        details = browser.css(".cal-content.pointer")
        details.each do |detail|
          title = detail.text.strip
          next if title.blank?

          Rails.logger.info "   -> Clicking event: #{title}"
          detail.click
          sleep 4

          # TRÍCH XUẤT TỪ MODAL (p-dialog hoặc tương tự)
          modal = browser.at_css(".p-dialog, .p-sidebar, .modal-content, .p-dynamic-dialog")
          if modal
            # Logo/Banner
            img_el = modal.at_css("img.icon-mkt, img[src*='content.accesstrade.vn'], .modal-body img")
            image_url = img_el&.attribute("src")

            # Mô tả đầy đủ
            desc_el = modal.at_css(".p-dialog-content, .modal-body, .content-detail")
            description = desc_el&.text&.strip || title

            # Link Affiliate
            link_el = modal.at_css("a[href*='shorten.asia'], .btn-primary")
            aff_url = link_el&.attribute("href")

            # Merchant
            merchant = title.match(/\[(.*?)\]/) ? title.match(/\[(.*?)\]/)[1] : "Accesstrade"

            # Lưu record
            deal = Deal.find_or_initialize_by(title: title)
            deal.assign_attributes(
              merchant_name: merchant,
              description: description[0..1000], # Lưu nhiều hơn
              image_url: image_url,
              affiliate_url: aff_url || "https://pub2.accesstrade.vn/tool/hot_deal",
              category: category,
              is_hot: true,
              status: :active,
              source_platform: "Accesstrade"
            )

            if deal.save
              suffix = aff_url ? "(Link OK)" : "(Link Fallback)"
              Rails.logger.info "      ✅ Đã lưu: #{merchant} #{suffix}"
            end

            # ĐÓNG MODAL
            close_btn = modal.at_css(".p-dialog-header-close, .close, [data-dismiss='modal']")
            close_btn&.click
            sleep 1
          end
        end

        # Đóng row (nếu cần click chỗ khác) - Thường click chính nó hoặc click ra ngoài
      rescue => e
        Rails.logger.error "   ❌ Lỗi xử lý badge index #{index}: #{e.message}"
      end
    end
  end

  def find_real_affiliate_link(merchant)
    # Tìm bất kỳ Deal hoặc Coupon nào có chứa tên merchant này nhưng KHÔNG phải link fallback
    excluded = "https://pub2.accesstrade.vn/tool/hot_deal"

    link = Deal.where("merchant_name ILIKE ?", "%#{merchant}%")
               .where.not(affiliate_url: excluded)
               .order(created_at: :desc).pick(:affiliate_url)

    link ||= Coupon.where("title ILIKE ? OR platform ILIKE ?", "%#{merchant}%", "%#{merchant}%")
                   .where.not(affiliate_url: excluded)
                   .order(created_at: :desc).pick(:affiliate_url)
    link
  end
end
