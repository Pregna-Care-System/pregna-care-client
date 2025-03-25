FROM node:20-slim AS build

WORKDIR /app/swp391

COPY package*.json ./

RUN npm install --no-audit --no-fund && \
    npm install -g vite typescript

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]