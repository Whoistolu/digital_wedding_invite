Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :rsvps, only: [:create, :index]
  end

  root "application#index"
  get "*path", to: "application#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
