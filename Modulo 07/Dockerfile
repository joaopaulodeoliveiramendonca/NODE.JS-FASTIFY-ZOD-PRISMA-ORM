# Etapa única simplificada para DX
FROM node:20-alpine

# Dependências do Prisma (binários OpenSSL)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Gera Prisma Client já na imagem
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "src/app.js"]
