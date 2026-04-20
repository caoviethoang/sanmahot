# 🔥 SanMaHot — Coupon & Deal Aggregator Platform

A full-stack platform that automatically aggregates discount codes and deals from multiple e-commerce platforms in Vietnam.

## Project Structure

```
sanmahot/
├── backend/      # Ruby on Rails API
├── frontend/     # React + Vite
└── docker-compose.yml
```

---

## 🚀 Getting Started (Local)

### Prerequisites

- Docker & Docker Compose
- Node.js 22+

### Start all services

```bash
docker compose up -d
```

### View logs

```bash
docker logs sanmahot-rails -f
docker logs sanmahot-frontend -f
```

---

## 🕷️ Data Crawling

### Run a full crawl manually

```bash
docker exec sanmahot-rails bundle exec rake crawl:daily
```

This command runs the following steps in order:

1. **Sync Coupons** – Fetch coupon codes from AccessTrade API
2. **Sync Deals** – Fetch deals from AccessTrade API
3. **Sync Hot Coupons** – Fetch trending/hot coupons
4. **AT Calendar Bot** – Headless browser scrapes the Hot Deal calendar on AccessTrade (requires Chromium + `.env`)
5. **Article Crawler** – Scrapes promotional articles from `magiamgia.com`

### Automated Scheduling (Cron)

- Config file: `backend/config/schedule.rb`
- **Production**: uses `whenever` gem → cron job at **midnight daily**
- **Development**: runs via Sidekiq/GoodJob

To register the cron job on a server during deployment:

```bash
crontab -l | grep -v 'rake crawl:daily' | crontab -
(crontab -l 2>/dev/null; echo "0 0 * * * docker exec sanmahot-rails bundle exec rake crawl:daily >> /var/log/crawl.log 2>&1") | crontab -
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```env
# AccessTrade API Key – get it at: https://publisher.accesstrade.vn/settings/api
ACCESSTRADE_API_KEY=your_api_key_here

# AccessTrade Login – used by the headless browser bot
ACCESSTRADE_EMAIL=your_email@example.com
ACCESSTRADE_PASSWORD=your_password_here

# Database
DATABASE_URL=postgres://...

# Rails
RAILS_ENV=production
SECRET_KEY_BASE=...
```

> **Security note:** Never commit `.env` to Git. It is already in `.gitignore`.

---

## 🤖 GitHub Actions (CI)

Config file: `.github/workflows/ci.yml`

CI runs automatically on every push to any branch:

| Job          | What it does                                               |
| ------------ | ---------------------------------------------------------- |
| **Backend**  | Brakeman (security scan), Rubocop (lint), Rails test suite |
| **Frontend** | Build check via `npm run build`                            |

> Uses Node.js **v22 (LTS)** to avoid deprecation warnings.

---

## 📦 Data Sources

| Source              | Data Type            | Notes                                 |
| ------------------- | -------------------- | ------------------------------------- |
| **AccessTrade API** | Coupons, Deals       | Requires API Key + approved campaigns |
| **AccessTrade Bot** | Hot Deal calendar    | Requires login credentials + Chromium |
| **magiamgia.com**   | Promotional articles | Scrapes article content only          |

> ⚠️ **Important:** Only use affiliate links generated from your own AccessTrade account. Never use third-party affiliate links (e.g., from magiamgia.com) — all commissions would go to them, not you.

---

## 🗂️ Useful Commands

```bash
# Open Rails console
docker exec -it sanmahot-rails bundle exec rails console

# Run database migrations
docker exec sanmahot-rails bundle exec rails db:migrate

# Check data counts
docker exec sanmahot-rails bundle exec rails runner \
  "puts \"Coupons: #{Coupon.count}, Deals: #{Deal.count}, Articles: #{Article.count}\""
```

---

## 🚢 Deployment (when you have a server)

Add the following secrets to your GitHub repository:

- `SSH_HOST` – Server IP address
- `SSH_USER` – SSH username (e.g., `ubuntu` or `root`)
- `SSH_PRIVATE_KEY` – Contents of your `~/.ssh/id_rsa` private key

Then add `.github/workflows/deploy.yml` to auto-deploy after CI passes.
