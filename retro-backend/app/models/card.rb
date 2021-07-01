class Card < ApplicationRecord
    attribute :type, :string
    attribute :text, :string
    attribute :votes, :integer
    attribute :created_by, :string
    belongs_to :retro
end
