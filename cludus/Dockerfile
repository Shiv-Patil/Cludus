FROM node:17-slim

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .

RUN npm run deploy

CMD ["npm", "run", "dev"]
