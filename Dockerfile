FROM node:16.15.0

LABEL maintainer="Yuelin Wen <weny36@mcmaster.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

COPY package.json package-lock.json ./

RUN npm install

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD ["node","src/index.js"]

EXPOSE 8080
