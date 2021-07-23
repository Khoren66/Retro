class CardSerializer < ActiveModel::Serializer
  attributes :id, :card_type, :text,:votes, :created_by, :retro_id

# def cards_data
#     #@wells_cards = Card.find_by(card_type: 'wells')
#     wells= Card.select {|card| card.card_type==="wells" } 
#     improves= Card.select {|card| card.card_type==="improves" } 
#     actions= Card.select {|card| card.card_type==="actions" } 
#     {
#       wells: wells,
#       improves: improves,
#       actions: actions
#     }
# end
# def card_improves
#   @improves_cards = Card.find_by(card_type: 'improves')
# end
# def card_actions
#   @actions_cards = Card.find_by(card_type: 'actions')
# end


end
