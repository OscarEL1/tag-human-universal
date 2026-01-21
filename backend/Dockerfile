FROM node:18-alpine

WORKDIR /app

# Copiamos dependencies primero para aprovechar caché
COPY package*.json ./
RUN npm install

# Copiamos el código
COPY . .

# Exponemos el puerto estandar de Express
EXPOSE 3000

# Comando por defecto (usaremos nodemon luego)
CMD ["npm", "run", "dev"]