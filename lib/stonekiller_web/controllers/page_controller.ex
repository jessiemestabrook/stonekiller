defmodule StonekillerWeb.PageController do
  use StonekillerWeb, :controller
  # Disable layout for pwa
  plug :put_layout, false when action in [:pwa]

  def index(conn, _params) do
    render(conn, "index.html")
  end

  # The action that will serve the react app
  def pwa(conn, _params) do
    render(conn, "pwa.html")
  end
end
