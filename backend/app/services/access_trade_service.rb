class AccessTradeService
  include HTTParty
  base_uri "https://api.accesstrade.vn/v1"

  def initialize
    @access_key = ENV["ACCESSTRADE_API_KEY"] || ENV["ACCESSTRADE_ACCESS_KEY"]
  end

  def fetch_latest_offers(limit: 10)
    unless @access_key
      Rails.logger.warn("AccessTrade access key is missing.")
      return mock_data
    end

    response = self.class.get("/offers_informations", headers: headers)

    if response.success?
      offers = response.parsed_response["data"] || []
      # Simplistic filtering/mapping, take e-commerce offers or standard ones
      offers.take(limit).map do |offer|
        {
          name: offer["name"],
          merchant: offer["merchant"],
          content: offer["content"],
          coupons: offer["coupons"].to_a.map { |c| c["coupon_code"] },
          category: offer["categories"]&.first&.[]("category_name_show") || "Khuyến mãi",
          image: offer["image"],
          link: offer["aff_link"] || offer["link"]
        }
      end
    else
      Rails.logger.error("Failed to fetch AccessTrade offers: #{response.message}")
      mock_data
    end
  rescue StandardError => e
    Rails.logger.error("AccessTrade error: #{e.message}")
    mock_data
  end

  private

  def headers
    {
      "Authorization" => "Token #{@access_key}",
      "Content-Type" => "application/json"
    }
  end

  def mock_data
    [
      { name: "Shopee Hoàn Xu Extra 15%", merchant: "Shopee", commission: "7%", link: "https://shopee.vn" },
      { name: "Lazada Siêu Deal Công Nghệ", merchant: "Lazada", commission: "11%", link: "https://lazada.vn" },
      { name: "Tiki Sách giảm đến 50%", merchant: "Tiki", commission: "4%", link: "https://tiki.vn" }
    ]
  end
end
