FROM node:lts-alpine
COPY package.json /app/package.json
WORKDIR /app
RUN npm install

COPY src /app/src
COPY .env /app

RUN ls /app

ENTRYPOINT node -r dotenv/config src/index.js