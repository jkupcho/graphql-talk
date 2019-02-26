# Builder
FROM node:lts-alpine as builder

COPY package.json /tmp/package.json
WORKDIR /tmp

RUN npm install

COPY src /tmp/src
COPY public /tmp/public
RUN npm run build

# Nginx
FROM nginx:alpine

COPY --from=builder /tmp/build /var/www/ui
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/logs