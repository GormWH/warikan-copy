#!/bin/bash

./automation.sh ngrok > /dev/null
sleep 3
FRONTEND_URL=$(curl -s localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name == "frontend").public_url')
BACKEND_URL=$(curl -s localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.name == "backend").public_url')
echo "paste ${FRONTEND_URL} to Line Developers -> Your LIFF -> LIFF -> Endpoint URL"
echo "paste ${BACKEND_URL}/callback to Line Developers -> Your Bot -> Messaging API -> Webhook URL"
if [ -e frontend/.env ]; then
  FILE=frontend/.env
elif [ -e frontend/.env.local ]; then
  FILE=frontend/.env.local
fi
sed -i '' -e "s|REACT_APP_SERVER_BASE_URL.*|REACT_APP_SERVER_BASE_URL=${BACKEND_URL}|" ${FILE}
./automation.sh backend > /dev/null
./automation.sh frontend > /dev/null
