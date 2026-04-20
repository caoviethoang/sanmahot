# Dockerfile
FROM ruby:3.3.10

# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs chromium

WORKDIR /app

# Copy Gemfile
COPY Gemfile Gemfile.lock ./

RUN bundle install

# Copy app
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["bash", "-c", "rm -f tmp/pids/server.pid && bundle exec rails db:prepare && bundle exec rails s -b 0.0.0.0"]
