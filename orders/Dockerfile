FROM node:20-alpine

WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . ./
RUN yarn build

RUN npm install -g npm-run-all@4.1.5
CMD ["npm-run-all", "migrate:run", "start:prod"]
