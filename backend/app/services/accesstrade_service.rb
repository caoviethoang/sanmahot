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
    total_saved = 0
    (1..max_pages).each do |page|
      Rails.logger.info "Đang crawl AccessTrade trang #{page}..."

      params = { page: page, limit: 50 }
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
        break if offers.blank? # Dừng nếu không còn dữ liệu

        saved_in_page = process_offers(offers)
        total_saved += saved_in_page

        # Nếu trang hiện tại ít hơn limit, có thể là trang cuối
        break if offers.size < 50
      else
        Rails.logger.error "AccessTrade API Error trang #{page}: #{res.code} - #{res.body}"
        break
      end
    end

    Rails.logger.info "HOÀN TẤT: Tổng cộng đã đồng bộ thành công #{total_saved} coupons mới/cập nhật."
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
          category = "Ưu đãi"
          category = "Freeship" if full_text.include?("freeship") || full_text.include?("vận chuyển")
          category = "Điện tử" if full_text.include?("điện tử") || full_text.include?("laptop") || full_text.include?("điện thoại") || full_text.include?("điên tử")
          category = "Gia dụng" if full_text.include?("gia dụng") || full_text.include?("bếp")
          category = "Thời trang" if full_text.include?("thời trang") || full_text.include?("quần áo")
          category = "Hoàn tiền" if full_text.include?("hoàn tiền") || full_text.include?("cashback")

          coupon = Coupon.find_or_initialize_by(code: code, platform: platform.downcase)
          coupon.assign_attributes(
            title: item["name"] || "Khuyến mãi #{platform}",
            description: c_item["coupon_desc"] || item["content"],
            affiliate_url: item["aff_link"] || item["link"],
            discount_value: extract_discount(c_item["coupon_desc"] || item["name"]),
            start_at: item["start_time"],
            end_at: item["end_time"],
            category: category,
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

  def extract_discount(text)
    return nil if text.blank?
    # Lấy số đầu tiên tìm thấy trong chuỗi (ví dụ: "Giảm 120,000 VNĐ" -> 120000)
    match = text.gsub(",", "").scan(/\d+/).first
    match ? match.to_i : nil
  end
end
