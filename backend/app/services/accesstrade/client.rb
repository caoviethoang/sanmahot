require "net/http"
require "json"

module Accesstrade
  class Client
    BASE_URL = "https://api.accesstrade.vn/v1".freeze

    class Error < StandardError; end

    def initialize(api_key: nil)
      @api_key = api_key || ENV["ACCESSTRADE_API_KEY"]
      raise Error, "Missing AccessTrade API Key" if @api_key.blank?
    end

    def get(path, params = {})
      request(:get, path, params)
    end

    def post(path, body = {})
      request(:post, path, {}, body)
    end

    def fetch_paged(path, params = {}, max_pages: 100)
      current_page = 1
      all_data = []

      loop do
        break if current_page > max_pages

        response = get(path, params.merge(page: current_page, limit: 50))
        data = response["data"]

        break if data.blank?

        yield(data, current_page) if block_given?
        all_data.concat(data)

        break if data.size < 50
        current_page += 1
      end

      all_data
    end

    private

    def request(method, path, params = {}, body = nil)
      uri = URI("#{BASE_URL}#{path}")
      uri.query = URI.encode_www_form(params) if params.present?

      http = Net::HTTP.new(uri.hostname, uri.port)
      http.use_ssl = true

      request = case method
      when :get
                  Net::HTTP::Get.new(uri)
      when :post
                  Net::HTTP::Post.new(uri)
      end

      request["Authorization"] = "Token #{@api_key}"
      request["Content-Type"] = "application/json"
      request.body = body.to_json if body.present?

      response = http.request(request)

      handle_response(response)
    rescue StandardError => e
      Rails.logger.error "AccessTrade Client Error: #{e.message}"
      raise Error, e.message
    end

    def handle_response(response)
      case response
      when Net::HTTPSuccess
        JSON.parse(response.body)
      else
        error_msg = "API Error: #{response.code} - #{response.body}"
        Rails.logger.error error_msg
        raise Error, error_msg
      end
    end
  end
end
