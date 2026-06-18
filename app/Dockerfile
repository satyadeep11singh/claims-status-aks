FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY db ./db

RUN node db/seed.js

EXPOSE 3000

CMD ["node", "server.js"]