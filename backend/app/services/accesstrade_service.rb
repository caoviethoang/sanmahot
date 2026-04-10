require "net/http"
require "json"

class AccesstradeService
  PLATFORM_MAPPING = {
    "shopee" => "shopee",
    "shopeevn" => "shopee",
    "lazada" => "lazada",
    "lazadavn" => "lazada",
    "tiki" => "tiki",
    "tikivn" => "tiki",
    "shopeefood" => "shopeefood",
    "sendo" => "sendo",
    "nguyenkim" => "nguyenkim",
    "fahasa" => "fahasa",
    "grab" => "grab",
    "grabvn" => "grab",
    "fptshop" => "fptshop",
    "xanhsm" => "xanhsm",
    "xanhsm_car" => "xanhsm",
    "xanhsmbike" => "xanhsm",
    "vnpay" => "vnpay",
    "lazada_malay" => "lazada",
    "lazada_sing" => "lazada"
  }.freeze

  def initialize
    @api_key = ENV["ACCESSTRADE_API_KEY"]
  end

  def sync_coupons(max_pages = 10)
    sync_data(max_pages, coupon_flag: 1)
  end

  def sync_deals(max_pages = 10)
    sync_data(max_pages, coupon_flag: 0)
  end

  private

  def sync_data(max_pages, coupon_flag:)
    total_saved = 0
    type_name = coupon_flag == 1 ? "Coupon" : "Deal"

    (1..max_pages).each do |page|
      Rails.logger.info "Đang crawl AccessTrade #{type_name} trang #{page}..."

      params = { page: page, limit: 50, status: 1 }
      uri = URI("https://api.accesstrade.vn/v1/offers_informations")
      uri.query = URI.encode_www_form(params)

      req = Net::HTTP::Get.new(uri)
      req["Authorization"] = "Token #{@api_key}"
      req["Content-Type"] = "application/json"

      res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(req)
      end

      if res.is_a?(Net::HTTPSuccess)
        data = JSON.parse(res.body)
        offers = data["data"]
        break if offers.blank?

        saved_in_page = if coupon_flag == 1
                          process_offers(offers)
        else
                          process_deals(offers)
        end
        total_saved += saved_in_page

        break if offers.size < 50
      else
        Rails.logger.error "AccessTrade API Error trang #{page}: #{res.code} - #{res.body}"
        break
      end
    end

    Rails.logger.info "HOÀN TẤT: Tổng cộng đã đồng bộ thành công #{total_saved} #{type_name} mới/cập nhật."
    total_saved
  end

  private

  def process_offers(offers_data)
    saved_count = 0
    offers_data.each do |item|
      raw_merchant = item["merchant"]&.downcase
      platform = PLATFORM_MAPPING[raw_merchant] || raw_merchant

      # Một offer từ AccessTrade có thể chứa mảng các coupons
      if item["coupons"].present? && item["coupons"].is_a?(Array)
        item["coupons"].each do |c_item|
          code = c_item["coupon_code"] || c_item["code"]
          next if code.blank?

          full_text = "#{item["name"]} #{c_item["coupon_desc"]}".downcase
          category_name = detect_category_name(full_text)

          coupon = Coupon.find_or_initialize_by(code: code, platform: platform.downcase)
          coupon.assign_attributes(
            title: item["name"] || "Khuyến mãi #{platform}",
            description: c_item["coupon_desc"] || item["content"],
            affiliate_url: item["aff_link"] || item["link"],
            discount_value: extract_discount(c_item["coupon_desc"] || item["name"]),
            start_at: item["start_time"],
            end_at: item["end_time"],
            category: category_name,
            terms: c_item["coupon_desc"] || item["content"],
            target_users: full_text.include?("mới") ? "Khách hàng mới" : "Tất cả khách hàng",
            status: :active
          )

          # Convert end_at string to Time for comparison
          end_time = coupon.end_at.present? ? Time.zone.parse(coupon.end_at.to_s) : nil

          if end_time.nil? || end_time > Time.current
            saved_count += 1 if coupon.save
          end
        end
      end
    end
    saved_count
  end

  def process_deals(offers_data)
    saved_count = 0
    offers_data.each do |item|
      raw_merchant = item["merchant"]&.downcase
      platform = PLATFORM_MAPPING[raw_merchant] || raw_merchant

      full_text = "#{item["name"]} #{item["content"]}".downcase
      category_name = detect_category_name(full_text)
      category = Category.find_or_create_by!(name: category_name)

      deal = Deal.find_or_initialize_by(affiliate_url: item["aff_link"] || item["link"])

      # Extract prices if possible, otherwise use from name/content
      # Improved extraction: look for patterns like "X.XXXđ" or "X,XXX.XXX VNĐ"
      prices = extract_all_prices(full_text)

      original_price = prices.max
      sale_price = prices.min if prices.size > 1
      sale_price ||= original_price # Fallback if only one price found

      # If we extracted the same price, and there's a discount percent, calculate sale_price
      discount_percent = extract_discount_percent(item["name"] || "")
      if original_price && sale_price == original_price && discount_percent
        sale_price = original_price * (100 - discount_percent) / 100
      end

      deal.assign_attributes(
        title: item["name"],
        description: item["content"],
        merchant_name: platform.capitalize,
        source_platform: platform,
        image_url: item["image"] || "https://picsum.photos/seed/#{rand(1000)}/400/300",
        discount_percent: discount_percent,
        original_price: original_price,
        sale_price: sale_price,
        start_at: item["start_time"],
        expired_at: item["end_time"],
        category: category,
        status: :active
      )

      # Check if expired
      expired_time = deal.expired_at.present? ? Time.zone.parse(deal.expired_at.to_s) : nil
      if expired_time.nil? || expired_time > Time.current
        saved_count += 1 if deal.save
      end
    end
    saved_count
  end

  def detect_category_name(text)
    category = "Ưu đãi"
    category = "Freeship" if text.include?("freeship") || text.include?("vận chuyển")
    category = "Electronics" if text.include?("điện tử") || text.include?("laptop") || text.include?("điện thoại") || text.include?("tablet")
    category = "Home & Kitchen" if text.include?("gia dụng") || text.include?("bếp") || text.include?("nội thất")
    category = "Fashion" if text.include?("thời trang") || text.include?("quần áo") || text.include?("giày")
    category = "Beauty" if text.include?("làm đẹp") || text.include?("mỹ phẩm") || text.include?("skincare") || text.include?("beauty")
    category
  end

  def extract_discount_percent(text)
    # Tìm chuỗi "giảm X%" hoặc "X%" hoặc "uudai X%"
    match = text.scan(/(\d+)\s*%/).first
    match ? match.first.to_i : nil
  end

  def extract_discount(text)
    extract_all_prices(text).first
  end

  def extract_all_prices(text)
    return [] if text.blank?

    # Tìm các số có đi kèm ký hiệu tiền tệ hoặc hậu tố "k"
    # m1: số + đ/vnđ/vnd
    # m2: số + k (ví dụ 50k, 100k)
    # Loại bỏ các số giống như năm (ví dụ 2024, 2025, 2026) nếu không có đơn vị

    clean_text = text.gsub(",", "")

    prices = []

    # Pattern 1: X.XXXđ/VNĐ
    clean_text.scan(/(\d+)\s*(?:đ|vnđ|vnd)/i).each { |m| prices << m.first.to_i }

    # Pattern 2: Xk (ví dụ 50k -> 50000)
    clean_text.scan(/(\d+)k/i).each { |m| prices << m.first.to_i * 1000 }

    # Pattern 3: Số lớn đứng sau chữ "giảm" hoặc "chỉ" (tránh năm 2018)
    clean_text.scan(/(?:giảm|chỉ)\s*(\d{4,})/i).each { |m| prices << m.first.to_i }

    prices.uniq
  end
end
