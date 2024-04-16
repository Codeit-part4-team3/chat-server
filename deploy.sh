#!/bin/bash
cd /home/ubuntu/chat-server
git pull origin main
sudo npm install
sudo npm run build
pm2 start ecosystem.config.ts
