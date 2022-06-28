FROM node:latest-alpine
WORKDIR /app/solar

COPY package*json .

RUN npm install
COPY . .

CMD ["node", "index.js"]