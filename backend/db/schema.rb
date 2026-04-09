# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_04_09_015704) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "jti", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["jti"], name: "index_admins_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
  end

  create_table "affiliate_clicks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.string "referrer"
    t.bigint "trackable_id", null: false
    t.string "trackable_type", null: false
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.index ["trackable_type", "trackable_id"], name: "index_affiliate_clicks_on_trackable"
  end

  create_table "articles", force: :cascade do |t|
    t.string "category"
    t.text "content"
    t.datetime "created_at", null: false
    t.text "excerpt"
    t.string "image_url"
    t.string "meta_description"
    t.string "meta_title"
    t.string "platform"
    t.datetime "published_at"
    t.string "slug"
    t.integer "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["platform"], name: "index_articles_on_platform"
    t.index ["slug"], name: "index_articles_on_slug"
  end

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "name"
    t.string "slug"
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_categories_on_slug"
  end

  create_table "coupons", force: :cascade do |t|
    t.string "affiliate_url"
    t.string "category"
    t.string "code"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "discount_type"
    t.decimal "discount_value"
    t.datetime "end_at"
    t.decimal "min_order_value"
    t.string "platform"
    t.string "slug"
    t.datetime "start_at"
    t.integer "status"
    t.string "target_users"
    t.text "terms"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_coupons_on_slug"
  end

  create_table "deal_tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "deal_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "updated_at", null: false
    t.index ["deal_id"], name: "index_deal_tags_on_deal_id"
    t.index ["tag_id"], name: "index_deal_tags_on_tag_id"
  end

  create_table "deals", force: :cascade do |t|
    t.string "affiliate_url"
    t.bigint "category_id", null: false
    t.string "coupon_code"
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "discount_percent"
    t.datetime "expired_at"
    t.string "image_url"
    t.string "merchant_name"
    t.decimal "original_price"
    t.decimal "sale_price"
    t.string "slug"
    t.string "source_platform"
    t.datetime "start_at"
    t.integer "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_deals_on_category_id"
    t.index ["slug"], name: "index_deals_on_slug"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.datetime "created_at"
    t.string "scope"
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "tags", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.string "slug"
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_tags_on_slug"
  end

  add_foreign_key "deal_tags", "deals"
  add_foreign_key "deal_tags", "tags"
  add_foreign_key "deals", "categories"
end
