FROM node:18.17.0-alpine

ENV PORT=1111
ENV TZ=Asia/Jakarta
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Jakarta /etc/localtime

COPY . /app
WORKDIR /app

RUN npm i --force
RUN npm run build

#build image too long, disable it
# RUN addgroup --system bms \
#     && adduser --system bms --ingroup bms \
#     && chown -R bms:bms /app
# USER bms

ENTRYPOINT ["npx","serve","-p","1111"]
