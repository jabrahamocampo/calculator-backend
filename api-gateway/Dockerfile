# Etapa base: Node.js en Alpine
FROM node:20-alpine

# Instalar PostgreSQL client (pg_isready) y dependencias necesarias
RUN apk add --no-cache postgresql-client bash

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias e instalar
COPY package*.json ./
RUN npm ci --only=production

# Copiar todo el código fuente
COPY . .

# Copiar el script de espera a PostgreSQL y dar permisos
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Exponer puerto
EXPOSE 8080

# Ejecutar script de espera y luego iniciar el servidor
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
