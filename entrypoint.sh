#!/bin/sh
npx sequelize-cli db:migrate
npm run start:dev
exec "$@"
