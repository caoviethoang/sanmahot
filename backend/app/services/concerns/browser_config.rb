# frozen_string_literal: true

# BrowserConfig
#
# Shared Ferrum browser options used by headless scraper services.
# Include this module and call `browser_options` to retrieve the merged config.
#
module BrowserConfig
  DEFAULT_OPTIONS = {
    window_size: [ 1366, 768 ],
    browser_options: {
      "no-sandbox":            nil,
      "disable-dev-shm-usage": nil,
      "disable-gpu":           nil
    },
    timeout: 60
  }.freeze

  def browser_options
    opts = DEFAULT_OPTIONS.dup
    opts[:browser_path] = "/usr/bin/chromium" if File.exist?("/usr/bin/chromium")
    opts
  end
end
