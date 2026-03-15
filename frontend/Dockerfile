# Etapa 1: Construcción (Build)
FROM node:22-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 👉 EL SECRETO DEVOPS: Atrapa la URL de Render para que Vite la hornee
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos la carpeta 'dist' generada por Vite a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 👉 CORRECCIÓN DE PUERTO: En el Dockerfile solo se expone el puerto interno
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]