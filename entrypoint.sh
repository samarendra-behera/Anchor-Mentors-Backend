#!/bin/sh
npx sequelize-cli db:migrate
npm run daysetup
npm run start:dev
exec "$@"
