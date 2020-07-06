FROM node:12

WORKDIR /corona-sim/bin

COPY package*.json ./

RUN yarn install --production=false

RUN yarn global add webpack webpack-dev-server

COPY . .

EXPOSE 10000

CMD [ "webpack-dev-server", "--open", "--config", "webpack.config.js" ]