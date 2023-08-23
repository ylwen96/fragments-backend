# first docker file of my fragments microserver!

# Stage 1: install the base dependencies

# FROM keyword
# Use node version 16.15.1
# FROM node:16.15.1 AS dependencies
FROM node:16.15.1-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS dependencies

# LABEL - key value pair with arbitrary metadate about my image
LABEL maintainer="Yuelin Wen <ywen26@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# ENV variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

###########################################################################################
# Stage 2: build and deploy
FROM node:16.15.1-alpine@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS deploy

WORKDIR /app
# Copy the generated dependencies (node_moduels/)
COPY --from=dependencies /app /app
# Copy src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# install curl
RUN apk --no-cache add curl

# Start the container by running our server
CMD ["node","src/index.js"]

# We run our service on port 8080
EXPOSE 8080

# HEALTH check
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3\
 CMD --chown=node:node curl --fail http://localhost:8080 || exit 1
