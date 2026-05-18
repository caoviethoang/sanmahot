# frozen_string_literal: true

require "openai"

class AiContentGeneratorService
  def initialize
    api_key = ENV["OPENAI_API_KEY"]
    @client = api_key.present? ? OpenAI::Client.new(access_token: api_key) : nil
  end

  def generate(prompt)
    return mock_generate(prompt) unless @client

    full_prompt = <<~PROMPT
      Bạn là một chuyên gia săn sale và biên tập nội dung số cực kỳ thu hút. \
      Nhiệm vụ: Viết 1 bài viết 'Tin Khuyến Mãi' (500-800 chữ) bằng HTML chuẩn (chỉ xuất các thẻ trong <body>).

      Dữ liệu Deal và Coupon hôm nay:
      #{prompt}

      Yêu cầu cấu trúc bài viết:
      1. <h2 style='color: #e11d48;'>Tiêu đề GIẬT GÂN, thu hút người mua ngay lập tức.</h2>
      2. Mở bài bằng một đoạn dẫn đầy cảm hứng về lợi ích của đợt sale này.
      3. Danh sách Deal/Coupon được trình bày trong các <div> có style hiện đại (border, padding, shadow).
      4. Với mỗi Deal, chèn ảnh <img src='...' style='width: 100%; border-radius: 12px;' /> nếu có.
      5. Các nút bấm <a href='...' style='...'>SĂN DEAL NGAY</a> nổi bật với màu gradient hoặc đỏ nổi bật.
      6. Thêm một phần 'Mẹo Săn Sale' chuyên sâu cho các sàn thương mại điện tử liên quan.
      7. Kết bài bằng lời kêu gọi mua sắm mạnh mẽ.
    PROMPT

    response = @client.chat(
      parameters: {
        model:       "gpt-4o-mini",
        messages:    [ { role: "user", content: full_prompt } ],
        temperature: 0.7
      }
    )
    response.dig("choices", 0, "message", "content")
  rescue StandardError => e
    Rails.logger.error("AI Generation Error: #{e.message}")
    mock_generate(prompt)
  end

  private

  def mock_generate(prompt)
    lines    = prompt.split("\n\n")
    merchant = prompt.match(/Nền tảng: (.*)/)&.[](1) || "Cửa hàng"

    html  = "<h2>Đại Tiệc Khuyến Mãi #{merchant} - Tổng Hợp Mới Nhất</h2>\n"
    html += "<p>Chào mừng bạn quay lại với SanMaHot! Hôm nay chúng tôi mang đến danh sách tổng hợp các ưu đãi khủng không thể bỏ qua.</p>\n"

    lines.each do |item|
      name    = item.match(/- Sản phẩm: (.*)/)&.[](1)
      link    = item.match(/URL: (.*)/)&.[](1)
      image   = item.match(/Banner: (.*)/)&.[](1)
      coupons = item.match(/Mã: (.*)/)&.[](1)

      html += "<div style='border: 1px solid #eee; padding: 15px; border-radius: 10px; margin-bottom: 20px;'>\n"
      html += "<h3>#{name}</h3>\n"
      html += "<img src='#{image}' style='max-width:100%; border-radius:8px;' />\n" if image.present?
      html += "<p>🎟️ <strong>Mã: #{coupons}</strong></p>\n" if coupons.present? && coupons.strip != ""
      html += "<a href='#{link}' target='_blank' style='display:inline-block; padding:8px 16px; background:#ef4444; color:#fff; border-radius:5px; text-decoration:none;'>SĂN DEAL NGAY</a>\n"
      html += "</div>\n"
    end

    html + "<h3>Kinh nghiệm mua sắm:</h3><p>Hãy nhanh tay kẻo hết lượt dùng mã nhé!</p>"
  end
end
