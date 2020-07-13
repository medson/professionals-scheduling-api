FROM node:13.12-alpine AS build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install --production

COPY . .


# Final stage
FROM node:13.12-alpine

COPY --from=build /usr/src/app/ ./

EXPOSE 3000

CMD yarn start
