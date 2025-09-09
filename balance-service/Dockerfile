# 1. Node.js LTS base image
FROM node:20-alpine

# 2. Install bash and postgresql-client for wait-for-postgres.sh
RUN apk add --no-cache bash postgresql-client

# 3. Working directory inside the container
WORKDIR /usr/src/app

# 4. Copy package.json and package-lock.json
COPY package*.json ./

# 5. Install production dependencies
RUN npm ci --only=production

# 6. Copy the rest of the source code
COPY . .

# 7. Copy wait-for-postgres script and grant permissions
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# 8. Expose the service port
EXPOSE 4003

# 9. Command to wait for Postgres and then start the app
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
