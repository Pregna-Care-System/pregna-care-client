FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install -g npm@latest

RUN rm -rf node_modules package-lock.json

RUN npm ci --no-audit --no-fund || npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]