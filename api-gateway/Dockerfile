FROM node:20-alpine

WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

CMD ["yarn", "start:prod"]
