defmodule Stonekiller.Repo do
  use Ecto.Repo,
    otp_app: :stonekiller,
    adapter: Ecto.Adapters.Postgres
end
