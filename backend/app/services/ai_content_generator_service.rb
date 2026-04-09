require "openai"

class AiContentGeneratorService
  def initialize
    api_key = ENV["OPENAI_API_KEY"]
    if api_key.present?
      @client = OpenAI::Client.new(access_token: api_key)
    else
      @client = nil
    end
  end

  def generate(prompt)
    return mock_generate(prompt) if @client.nil?

    full_prompt = <<~PROMPT
      Bạn là một tổng biên tập báo săn sale chuyên nghiệp. Hãy viết 1 bài viết Tin Khuyến Mãi (khoảng 500-800 chữ) bằng HTML chuẩn (chỉ xuất tags trong <body>).

      Dữ liệu các Deal hôm nay:
      #{prompt}

      Yêu cầu:
      1. Viết tiêu đề h2 cực kỳ thu hút về đợt khuyến mãi này.
      2. Mở bài dẫn dắt lý do vì sao người dùng nên mua sắm ngay lúc này.
      3. Trình bày các Deal bên dưới theo dạng danh sách hoặc bảng cực kỳ đẹp mắt.
      4. Với mỗi deal quan trọng, hãy chèn hình ảnh banner kèm theo (sử dụng tag <img src="..." /> từ dữ liệu).
      5. Tạo các nút bấm <a href="..." style="...">XEM DEAL</a> cho mỗi sản phẩm.
      6. Thêm đoạn kinh nghiệm săn sale liên quan đến Merchant này.
      7. Kết bài kêu gọi hành động.
    PROMPT

    begin
      response = @client.chat(
        parameters: {
          model: "gpt-4o-mini",
          messages: [ { role: "user", content: full_prompt } ],
          temperature: 0.7
        }
      )
      response.dig("choices", 0, "message", "content")
    rescue StandardError => e
      Rails.logger.error("AI Generation Error: #{e.message}")
      mock_generate(prompt)
    end
  end

  private

  def mock_generate(prompt)
    lines = prompt.split("\n\n")
    merchant = prompt.match(/Nền tảng: (.*)/)&.[](1) || "Cửa hàng"

    html = "<h2>Đại Tiệc Khuyến Mãi #{merchant} - Tổng Hợp Mới Nhất</h2>\n"
    html += "<p>Chào mừng bạn quay lại với SanMaHot! Hôm nay chúng tôi mang đến danh sách tổng hợp các ưu đãi khủng không thể bỏ qua.</p>\n"

    lines.each do |item|
      name = item.match(/- Sản phẩm: (.*)/)&.[](1)
      link = item.match(/URL: (.*)/)&.[](1)
      image = item.match(/Banner: (.*)/)&.[](1)
      coupons = item.match(/Mã: (.*)/)&.[](1)

      html += "<div style='border: 1px solid #eee; padding: 15px; border-radius: 10px; margin-bottom: 20px;'>\n"
      html += "<h3>#{name}</h3>\n"
      if image.present?
        html += "<img src='#{image}' style='max-width:100%; border-radius:8px;' />\n"
      end
      if coupons.present? && coupons.strip != ""
        html += "<p>🎟️ <strong>Mã: #{coupons}</strong></p>\n"
      end
      html += "<a href='#{link}' target='_blank' style='display:inline-block; padding:8px 16px; background:#ef4444; color:#fff; border-radius:5px; text-decoration:none;'>SĂN DEAL NGAY</a>\n"
      html += "</div>\n"
    end

    html += "<h3>Kinh nghiệm mua sắm:</h3><p>Hãy nhanh tay kẻo hết lượt dùng mã nhé!</p>"
    html
  end
end
