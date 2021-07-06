#! /bin/sh
docker build -t saga/tests .
sleep 5
docker build -t saga/app ./front-end/
docker build -t saga/server ./back-end/
docker-compose up -d
echo "Wait some seconds before running the app"
sleep 20