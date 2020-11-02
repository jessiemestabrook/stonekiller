defmodule StonekillerWeb.PageView do
  use StonekillerWeb, :view

  def render("pwa.html", _assigns) do
    Path.join(:code.priv_dir(:your_app), "static/build/index.html")
    |> File.read!()
    |> raw()
  end
end
