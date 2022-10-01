FROM node:16-alpine as next

USER root
RUN corepack enable && apk update && apk add python3 build-base

WORKDIR /app
# Create a folder for the mount point so the permissions are carried over.
RUN mkdir -p .yarn/unplugged
RUN chown -R node:node .
USER node

FROM alexjball/firebase-tools:latest-node-16 as firebase

USER root
WORKDIR /app
RUN mkdir -p .yarn/unplugged
RUN chown -R node:node .
USER node