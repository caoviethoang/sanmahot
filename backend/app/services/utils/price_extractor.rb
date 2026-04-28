module Utils
  class PriceExtractor
    def self.extract_all(text)
      return [] if text.blank?

      # Remove commas for easier parsing
      clean_text = text.gsub(",", "")

      prices = []

      # Pattern 1: X.XXXđ/VNĐ/VND (e.g., 50.000đ, 1.000.000 VNĐ)
      clean_text.scan(/(\d+)\s*(?:đ|vnđ|vnd)/i).each { |m| prices << m.first.to_i }

      # Pattern 2: Xk (e.g., 50k -> 50000)
      clean_text.scan(/(\d+)k\b/i).each { |m| prices << m.first.to_i * 1000 }

      # Pattern 3: Large numbers after "giảm" or "chỉ" (avoid years like 2024)
      clean_text.scan(/(?:giảm|chỉ)\s*(\d{4,})/i).each { |m| prices << m.first.to_i }

      prices.uniq
    end

    def self.extract_discount_percent(text)
      return nil if text.blank?

      # Match "giảm X%" or "X%" or "uudai X%"
      match = text.scan(/(\d+)\s*%/).first
      match ? match.first.to_i : nil
    end

    def self.extract_first(text)
      extract_all(text).first
    end
  end
end
