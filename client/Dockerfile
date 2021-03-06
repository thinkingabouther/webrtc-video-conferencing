FROM node:14-alpine

ADD yarn.lock package.json /app/
WORKDIR /app
RUN yarn install

COPY . /app
CMD ["yarn", "start"]
