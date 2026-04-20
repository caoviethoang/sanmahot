#!/usr/bin/env bash
# ===========================================
# SanMaHot - Deploy Script for EC2 (Ubuntu)
# Chạy script này lần đầu tiên sau khi SSH vào máy EC2
# ===========================================
set -e

DOMAIN="sanmahot.com"
EMAIL="admin@sanmahot.com"   # Email nhận thông báo SSL hết hạn

echo "=========================================="
echo "  SanMaHot Deployment Script"
echo "=========================================="

# 1. Cập nhật OS
echo "[1/7] Updating system packages..."
sudo apt-get update -qq && sudo apt-get upgrade -y -qq

# 2. Cài Docker
if ! command -v docker &> /dev/null; then
  echo "[2/7] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  newgrp docker
else
  echo "[2/7] Docker already installed. Skipping."
fi

# 3. Cài Docker Compose
if ! command -v docker compose &> /dev/null; then
  echo "[3/7] Installing Docker Compose..."
  sudo apt-get install -y docker-compose-plugin
else
  echo "[3/7] Docker Compose already installed. Skipping."
fi

# 4. Cài Certbot (SSL)
if ! command -v certbot &> /dev/null; then
  echo "[4/7] Installing Certbot..."
  sudo apt-get install -y certbot
else
  echo "[4/7] Certbot already installed. Skipping."
fi

# 5. Lấy chứng chỉ SSL (chỉ chạy lần đầu, cần domain đã trỏ về IP máy chủ)
echo "[5/7] Obtaining SSL certificate for $DOMAIN..."
sudo mkdir -p /var/www/certbot
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  sudo certbot certonly --standalone \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos \
    --non-interactive
  echo "SSL certificate obtained successfully!"
else
  echo "SSL certificate already exists. Skipping."
fi

# 6. Kiểm tra file .env
echo "[6/7] Checking .env file..."
if [ ! -f ".env" ]; then
  echo "ERROR: Không tìm thấy file .env!"
  echo "Hãy tạo file .env từ .env.example và điền các giá trị thật"
  echo "  cp .env.example .env && nano .env"
  exit 1
fi

# 7. Build và khởi động
echo "[7/7] Building and starting services..."
docker compose -f docker-compose.prod.yml pull --ignore-pull-failures
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "=========================================="
echo "  Deploy hoàn tất!"
echo "  Website: https://$DOMAIN"
echo "=========================================="

# Auto-renew SSL bằng cron job (chạy 2 lần/ngày)
CRON_RENEW="0 */12 * * * certbot renew --quiet && docker compose -f $(pwd)/docker-compose.prod.yml restart nginx"
# Daily Crawl Job (chạy lúc 0:00 hàng ngày) - sử dụng docker exec để chạy trong container
CRON_CRAWL="0 0 * * * docker exec sanmahot-rails bundle exec rake crawl:daily >> $(pwd)/backend/log/cron.log 2>&1"

(crontab -l 2>/dev/null | grep -v "certbot\|crawl:daily" ; echo "$CRON_RENEW" ; echo "$CRON_CRAWL") | crontab -
echo "Cron jobs (SSL renewal & Daily Crawl) configured."
