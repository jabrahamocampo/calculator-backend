# 1. Node.js Image Base
FROM node:20-alpine

# 2. PostgreSQL instal dependency client
RUN apk add --no-cache bash postgresql-client

# 3. Creates work directory
WORKDIR /usr/src/app

# 4. Copy dependency files
COPY package*.json ./

# 5. Install production dependency
RUN npm ci --only=production

# 6. Copy the code
COPY . .

# 7. Copy script and wait for PostgreSQL database
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# 8. Expose Port
EXPOSE 4001

# 9.  Execute script of wait and then start the server
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
