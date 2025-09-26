FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Inizializza DB con script JS
RUN node config/createDB.js

EXPOSE ${PORT}
CMD ["node", "server.js"]
