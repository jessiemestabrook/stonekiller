#!/bin/bash
echo "TRUST ALL LOCAL CONNECTIONS IN pg_hba.conf"
if test -d ./postgresql
then
  echo "host all all all trust" >> ./postgresql/data/pg_hba.conf
  echo "WAIT FOR POSTGRES RECOGNIZING NEW PERMISSIONS"
  sleep 10
  mix do ecto.create, ecto.migrate
  echo ""
  echo ""
  echo "IF ANY ERROR OCCURED RUN 'docker-deploy up init' AGAIN"
  echo "OTHERWISE YOU CAN START THE CONTAINER WITH:"
  echo ""
  echo "   docker-deploy up -d web      "
else
  echo "DATABASE NOT CREATED YET. PLEASE TRY AGAIN"
fi