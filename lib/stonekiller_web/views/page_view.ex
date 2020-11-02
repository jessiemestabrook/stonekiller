defmodule StonekillerWeb.PageView do
  use StonekillerWeb, :view

  def render("pwa.html", _assigns) do
    Path.join(:code.priv_dir(:stonekiller), "static/build/index.html")
    |> File.read!()
    |> raw()
  end
end
