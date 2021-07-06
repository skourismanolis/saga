#!/bin/bash
echo "~~SLEEPING TO LET THE DB INITIALIZE~~"
# sleep 20

echo "~~BACKEND~~"
cd ./back-end
yarn lint
yarn test-serve &
yarn test

# run cli tests
# echo "~~CLI APP~~"
# cd ../cli-app
# yarn lint
# yarn test

# kill test-serve
kill $(ps aux | grep '[y]arn test-serve' | awk '{print $2}')
kill $(ps aux | grep '[c]ross-env NODE_ENV=test node server.js' | awk '{print $2}')
kill $(ps aux | grep '[n]ode server.js' | awk '{print $2}')

echo "~~API CLIENT~~"
cd ../api-client
yarn lint
yarn mock > /dev/null &
yarn test
kill $(ps aux | grep '[y]arn mock' | awk '{print $2}')
kill $(ps aux | grep '[p]rism mock -d' | awk '{print $2}')
cd ../back-end
node server.js
cd ../front-end
yarn serve
