Rails.application.routes.draw do
  resources :cards
  resources :retros, param: :slug
  # get 'authentication/authenticate'
  resources :users, param: :user_id
  post 'authenticate', to: 'authentication#authenticate'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
