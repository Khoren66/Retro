class RetrosController < ApplicationController
  before_action :set_retro, only: %i[ show edit update destroy ]

  # GET /retros or /retros.json
  def index
    @retros = Retro.all
    respond_to do |format|
      format.json { render json: @retros}
    end
  end

  # GET /retros/1 or /retros/1.json
  def show
  end

  # GET /retros/new
  def new
    @retro = Retro.new
  end

  # GET /retros/1/edit
  def edit
  end

  # POST /retros or /retros.json
  def create
    
    @retro = Retro.new(retro_params)
    respond_to do |format|
      if @retro.save
        format.json { render json: @retro, serializer: RetroSerializer }
        #render JSON { retro: @retro,status: 200}
        #format.json { render :show, status: :created, location: @retro }
      else
        format.json { render json: @retro.errors } 
      end
    end
  end

  # PATCH/PUT /retros/1 or /retros/1.json
  def update
    respond_to do |format|
      if @retro.update(retro_params)
        format.json { render json: @retro, serializer: RetroSerializer }
       # format.json { render :show,  location: @retro }
      else
        format.json { render json: @retro.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /retros/1 or /retros/1.json
  def destroy

    @retro.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_retro
      @retro = Retro.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def retro_params
      params.fetch(:retro, {}).permit(:team_name, :retro_url, :user_id, :active)
    end
end
