Rails.application.routes.draw do
  devise_for :admins, path: "api/v1/admin", path_names: {
    sign_in: "login",
    sign_out: "logout"
  }, controllers: {
    sessions: "api/v1/admin/sessions"
  }, defaults: { format: :json }

  namespace :api do
    namespace :v1 do
      namespace :admin do
        resources :deals
        resources :coupons
        resources :categories
        resources :articles
        get "dashboard/stats", to: "dashboard#stats"
      end

      resources :deals, only: [ :index, :show ], param: :slug
      resources :coupons, only: [ :index ], param: :slug
      resources :categories, only: [ :index, :show ], param: :slug do
        member do
          get :deals
        end
      end
      resources :articles, only: [ :index, :show ], param: :slug
      get "search", to: "search#index"
      get "go/deal/:id", to: "redirects#deal"
      get "go/coupon/:id", to: "redirects#coupon"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
