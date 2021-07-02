class Retro < ApplicationRecord
    before_create :set_slug_to_random_key
    attribute :slug, :string
    attribute :active, :boolean, default: true
    belongs_to :user
    has_many :cards
    def set_slug_to_random_key
       self.slug = (0...30).map { ('a'..'z').to_a[rand(26)] }.join
    end
  
    def retro_url
        "http://localhost:3001/retros/#{slug}"
    end

    def date
        created_at.strftime('%d-%b-%Y %H:%M (%:z)')
    end
end
