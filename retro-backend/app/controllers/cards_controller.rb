class CardsController < ApplicationController
  before_action :set_card, only: [:show, :edit, :update, :destroy]

  respond_to :html
  # GET /cards or /cards.json
  def index
    @cards = Card.all
    @wells_cards = Card.find_by(card_type: 'wells')
    @improves_cards = Card.find_by(card_type: 'iproves')
    @actions_cards = Card.find_by(card_type: 'actions')
    respond_with(cards:{
wells: @wells_cards,
improves: @improves_cards,
actions: @actions_cards
    })
  end


  # GET /cards/1 or /cards/1.json
  def show
    respond_with(@card)
  end

  def new
    @card = Card.new
    respond_with(@card)
  end

  def edit
  end

  # POST /cards or /cards.json
  def create
    @card = Card.new(card_params)
    retro = Retro.find(card_params['retro_id'])
    p retro, 'CREATE RETRO=========>>>>>>>'
     respond_to do |format|
      if @card.save
        RetrosChannel.broadcast_to(retro,{
          retro: RetroSerializer.new(retro)
        })
        format.json { render json: @card, serializer: CardSerializer }
      else
        format.json { render json: @card.errors } 
      end
     end
  end

  # PATCH/PUT /cards/1 or /cards/1.json
  def update
    respond_to do |format|
      if @card.update(card_params)
        format.json { render json: @card, serializer: CardSerializer }
      else
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /cards/1 or /cards/1.json
  def destroy
    respond_to do |format|
      if @card.destroy
        format.json { render json: @card, serializer: CardSerializer }
      else
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  private
    def set_card
      @card = Card.find(params[:id])
    end

    def card_params
      params.require(:card).permit(:id, :card_type, :text, :created_by,:votes,:retro_id)
    end
end
