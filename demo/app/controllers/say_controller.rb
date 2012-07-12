class SayController < ApplicationController
  def Hello
    @time = Time.now
  end

  def Goodbye
  end
end
