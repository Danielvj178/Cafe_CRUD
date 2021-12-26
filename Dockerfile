FROM node:16-alpine3.13

WORKDIR /app
COPY . .
RUN yarn install --production

CMD ["node", "app.js"]

