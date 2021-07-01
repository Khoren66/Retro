class CardSerializer < ActiveModel::Serializer
  attributes :id, :type, :text,:votes, :created_by
end
