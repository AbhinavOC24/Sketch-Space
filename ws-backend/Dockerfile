FROM node:20-alpine

WORKDIR /app

# Install build dependencies for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 8002
ENV PORT=8002

CMD ["npm", "start"]
