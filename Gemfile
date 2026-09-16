source "https://rubygems.org"

# Core Jekyll
gem "jekyll", "~> 4.3.4"

# Theme
gem "minima", "~> 2.5"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "webrick", "~> 1.8.1"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance extensions
gem "wdm", "~> 0.2.0", :install_if => Gem.win_platform?

# Stdlib gems that are no longer default gems on Ruby >= 3.4 / 4.0 but Jekyll 4.3 still requires
gem "logger"
gem "csv"
gem "base64"
gem "bigdecimal"
