FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build || npx tsc

EXPOSE 5000

CMD ["node", "dist/src/index.js"]
