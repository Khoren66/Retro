class RetroSerializer < ActiveModel::Serializer
  attributes :id, :team_name, :active, :retro_id, :user_id, :retro_url, :date

end
