#!/bin/bash
echo "~~SLEEPING TO LET THE DB INITIALIZE~~"
sleep 20
echo "~~BACKEND~~"
cd ./back-end
yarn lint
yarn test-serve &
yarn test
echo "~~API CLIENT~~"
cd ../api-client
yarn lint
yarn mock > /dev/null &
yarn test