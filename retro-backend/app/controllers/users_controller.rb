class UsersController < ApplicationController
    def show
        @retros = Retro.where(user_id: params[:user_id])
        respond_to do |format|
            format.json { render json: @retros}
          end
        puts @retros
    end        
end
