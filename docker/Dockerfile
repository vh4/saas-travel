FROM node:18.17.0-alpine AS builder

ENV TZ=Asia/Jakarta
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

COPY . /app
WORKDIR /app

RUN npm i --force
RUN npx update-browserslist-db@latest
RUN npm run build

FROM webdevops/nginx:alpine

ENV WEB_DOCUMENT_ROOT=/app
ENV WEB_DOCUMENT_INDEX=index.html
RUN cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

COPY --from=builder /app/build/ /app/
WORKDIR /app
