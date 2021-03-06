FROM node:14-alpine

ADD yarn.lock package.json /app/
WORKDIR /app
RUN yarn install
ADD ./client/yarn.lock ./client/package.json /app/client/
RUN cd ./client && yarn

COPY . /app
RUN cd ./client && yarn build
ENV PROD=true
CMD ["npm", "start"]
