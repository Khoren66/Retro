class RetroSerializer < ActiveModel::Serializer
  attributes :id, :team_name, :active, :slug, :user_id, :retro_url, :date

end
