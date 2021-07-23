class RetrosChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    @retro =  Retro.find_by(slug: params[:retro])
    p "!!!!!!!!!!!!!!!!!!!!!!!STREAM"
    p params
    stream_for @retro
  end

  def received(data)
    p data, "=====>"
      RetrosChannel.broadcast_to(@retro,{retro:@retro})
  end
  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end