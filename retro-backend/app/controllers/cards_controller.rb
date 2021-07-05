class CardsController < ApplicationController
  before_action :set_card, only: [:show, :edit, :update, :destroy]

  respond_to :html
  # GET /cards or /cards.json
  def index
    @cards = Card.all
    respond_with(@cards)
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
    respond_to do |format|
      if @card.save
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
      params.require(:card).permit(:card_type, :text, :created_by,:votes,:retro_id)
    end
end
