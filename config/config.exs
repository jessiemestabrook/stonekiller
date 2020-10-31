# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :stonekiller,
  ecto_repos: [Stonekiller.Repo]

# Configures the endpoint
config :stonekiller, StonekillerWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "vTMY18FA7xBWiRTs/ipyRf6GlKoDCeO6CMQfA5ofYkOH/ldh4rcsFslfQP1DyOp/",
  render_errors: [view: StonekillerWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Stonekiller.PubSub,
  live_view: [signing_salt: "UhHCZ2sI"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
