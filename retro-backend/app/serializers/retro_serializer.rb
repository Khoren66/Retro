class RetroSerializer < ActiveModel::Serializer
  attributes :id, :team_name, :active, :slug, :user_id, :retro_url, :date
  has_many :cards

  attribute :cards_data do
    wells = object.cards.select { |card| card.card_type == "wells" } 
    improves = object.cards.select { |card| card.card_type == "improves" } 
    actions = object.cards.select { |card| card.card_type == "actions" } 
    {
      wells: wells,
      improves: improves,
      actions: actions
    }
  end
end
