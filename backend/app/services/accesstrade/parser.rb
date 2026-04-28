module Accesstrade
  class Parser
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
      "lazada_sing" => "lazada",
      "aeoneshop" => "aeon",
      "concung" => "concung",
      "bibomart" => "bibomart",
      "klook" => "klook",
      "kkday" => "kkday",
      "agoda" => "agoda",
      "traveloka" => "traveloka",
      "tours" => "trip"
    }.freeze

    def self.parse_coupon_attributes(item, coupon_item, is_hot: false)
      raw_merchant = item["merchant"]&.downcase
      platform = PLATFORM_MAPPING[raw_merchant] || raw_merchant || "other"

      full_text = "#{item["name"]} #{coupon_item["coupon_desc"]}".downcase

      {
        platform: platform.downcase,
        title: item["name"] || "Khuyến mãi #{platform}",
        description: coupon_item["coupon_desc"] || item["content"],
        affiliate_url: item["aff_link"] || item["link"],
        discount_value: Utils::PriceExtractor.extract_first(coupon_item["coupon_desc"] || item["name"]),
        start_at: item["start_time"],
        end_at: item["end_time"],
        category: detect_category_name(full_text),
        terms: coupon_item["coupon_desc"] || item["content"],
        target_users: full_text.include?("mới") ? "Khách hàng mới" : "Tất cả khách hàng",
        status: :active,
        is_hot: is_hot
      }
    end

    def self.parse_deal_attributes(item)
      raw_merchant = item["merchant"]&.downcase
      platform = PLATFORM_MAPPING[raw_merchant] || raw_merchant || "other"

      full_text = "#{item["name"]} #{item["content"]}".downcase
      prices = Utils::PriceExtractor.extract_all(full_text)

      original_price = prices.max
      sale_price = prices.size > 1 ? prices.min : original_price

      discount_percent = Utils::PriceExtractor.extract_discount_percent(item["name"] || "")
      if original_price && sale_price == original_price && discount_percent
        sale_price = original_price * (100 - discount_percent) / 100
      end

      {
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
        category_name: detect_category_name(full_text),
        status: :active
      }
    end

    def self.detect_category_name(text)
      return "Ưu đãi" if text.blank?

      return "Freeship" if text.include?("freeship") || text.include?("vận chuyển")
      return "Điện tử" if text.match?(/điện tử|laptop|điện thoại|tablet/)
      return "Nhà cửa & Đời sống" if text.match?(/gia dụng|bếp|nội thất/)
      return "Thời trang" if text.match?(/thời trang|quần áo|giày/)
      return "Làm đẹp" if text.match?(/làm đẹp|mỹ phẩm|skincare|beauty/)

      "Ưu đãi"
    end
  end
end
