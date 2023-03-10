# Creating a new image with dev devendencies.
FROM node:16.3.0-alpine as devendencies-dev
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:16.3.0-alpine as build
WORKDIR /app
COPY --from=devendencies-dev /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:16.3.0-alpine as devendencies-prod
WORKDIR /app
COPY package.json .
RUN npm install --omit-dev

FROM node:16.3.0-alpine as run
WORKDIR /app
COPY package.json .
COPY --from=build /app/build ./build
COPY --from=devendencies-prod /app/node_modules ./node_modules
COPY ./config ./config
EXPOSE 3000
CMD ["npm", "run", "start-with-docker"]