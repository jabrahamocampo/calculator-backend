# 1. Imagen base de Node.js LTS
FROM node:20-alpine

# 2. Instalar bash y postgresql-client para wait-for-postgres.sh
RUN apk add --no-cache bash postgresql-client

# 3. Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 4. Copiamos package.json y package-lock.json
COPY package*.json ./

# 5. Instalamos dependencias de producción
RUN npm ci --only=production

# 6. Copiamos el resto del código
COPY . .

# 7. Copiamos el script wait-for-postgres y le damos permisos
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# 8. Exponemos el puerto del servicio
EXPOSE 4002

# 9. Comando para esperar a Postgres y luego iniciar la app
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
