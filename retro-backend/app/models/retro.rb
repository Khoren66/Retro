class Retro < ApplicationRecord
    attribute :retro_id, :string, default: Time.now.to_i
    attribute :active, :boolean, default: true
    belongs_to :user
    def retro_url
        "http://localhost:3001/retros/#{retro_id}"
    end
    def date
        created_at.strftime('%d-%b-%Y %H:%M (%:z)')
     end 
      
end
