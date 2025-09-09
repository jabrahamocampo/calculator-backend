# Node.js Image Base
FROM node:20-alpine

# PostgreSQL instal dependency client
RUN apk add --no-cache postgresql-client bash

# Creates work directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package*.json ./
RUN npm ci --only=production

# Copy the code
COPY . .

# Copy script and wait for PostgreSQL database
COPY scripts/wait-for-postgres.sh /wait-for-postgres.sh
RUN chmod +x /wait-for-postgres.sh

# Expose port
EXPOSE 8080

# Execute script of wait and then start the server
CMD ["/wait-for-postgres.sh", "postgres", "node", "src/index.js"]
