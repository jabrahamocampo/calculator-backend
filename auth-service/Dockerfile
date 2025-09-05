# 1. Base Image Node.js LTS
FROM node:20-alpine

# 2. Instal bash and postgresql-client for wait-for-postgres.sh
RUN apk add --no-cache bash postgresql-client

# 3.Container's work directory
WORKDIR /usr/src/app

# 4. Copy package.json and package-lock.json
COPY package*.json ./

# 5. Production dependency instalation
RUN npm ci --only=production

# 6. Copy the code
COPY . .

# 7. Copy script wait-for-postgres and give grants
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# 8. Service Port
EXPOSE 4000

# 9. Command to wait Postgres and then start the app
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
