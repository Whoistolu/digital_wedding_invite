class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  def index
    render :index
  end
end
