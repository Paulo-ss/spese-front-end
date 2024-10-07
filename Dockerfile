FROM node:lts-slim

WORKDIR /home/spese-front-end

COPY . .

RUN npm install