FROM node:20-alpine

WORKDIR /app

# Install build dependencies for Prisma if needed (alpine)
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 8001
ENV PORT=8001

CMD ["npm", "start"]
