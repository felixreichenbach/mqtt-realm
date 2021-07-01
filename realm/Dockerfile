# syntax=docker/dockerfile:1
FROM node:slim
ENV REALM_APPID="<< REALM_APP_ID>>"
WORKDIR /app
COPY package*.json ./
# it seems the raspberry needs this
RUN apt-get update
RUN apt-get install libssl-dev -y
# RUN npm install
# If you are building your code for production
RUN npm ci --only=production
COPY . .
CMD ["node", "src/index.js"]
