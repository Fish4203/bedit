#!/usr/bin/env bash


if [ -n "$API_SECRET" ]
then
  rm /express-docker/.env
  echo 'API_SECRET='${API_SECRET}'' >> /express-docker/.env
  echo 'DB='${DB}'' >> /express-docker/.env
fi

cat /express-docker/.env

# node ./bin/www
pm2 start process.yml
