FROM node:lts-alpine
WORKDIR /app/solar

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 50057

CMD ["node", "index.js"]