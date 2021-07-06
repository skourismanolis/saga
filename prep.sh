#!/bin/bash

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# install npm
nvm install v16.2.0
npm install --global yarn
yarn
cd ./back-end
docker-compose up -d
cd ./tests
docker-compose up -d

echo "SLEEPING TO LET THE DB INITIALIZE"
sleep 15

echo "BACKEND"
cd ../
yarn lint
yarn test-serve &
yarn test

# run cli tests
echo "CLI APP"
cd ../cli-app
yarn lint
# yarn test

# kill test-serve
kill $(ps aux | grep '[y]arn test-serve' | awk '{print $2}')
kill $(ps aux | grep '[c]ross-env NODE_ENV=test node server.js' | awk '{print $2}')
kill $(ps aux | grep '[n]ode server.js' | awk '{print $2}')

echo "API CLIENT"
cd ../api-client
yarn lint
yarn mock > /dev/null &
yarn test
kill $(ps aux | grep '[y]arn mock' | awk '{print $2}')
kill $(ps aux | grep '[p]rism mock -d' | awk '{print $2}')
cd ../back-end
yarn server.js
cd ../front-end
yarn serve