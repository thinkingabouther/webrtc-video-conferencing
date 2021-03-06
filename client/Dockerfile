FROM node:14-alpine

ADD yarn.lock package.json /app/
WORKDIR /app
RUN yarn install
RUN yarn global add serve

COPY . /app
RUN yarn build
CMD ["serve", "-s", "build"]
