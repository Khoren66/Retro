class CardSerializer < ActiveModel::Serializer
  attributes :id, :card_type, :text,:votes, :created_by, :retro_id
end
