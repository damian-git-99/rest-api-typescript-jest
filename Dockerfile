FROM node:16.3.0-alpine as dev-deps
WORKDIR /app
COPY package.json .
RUN npm i
COPY ./src ./src
COPY ./config ./config
COPY ./tsconfig.json ./tsconfig.json
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start-with-docker"]