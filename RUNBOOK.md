
# Runbook - Full Stack Calculator Microservices Application

This RUNBOOK.md provides all details for **environment, migrations, seed data, and deployment steps** for all backend services.

## URL Repository 
https://github.com/jabrahamocampo/calculator-backend.git

## Table of Contents
1. [Overview](#overview)
2. [Migrations](#migrations)
3. [Seed Data](#seed-data)
4. [Rolling Deploy Steps](#rolling-deploy-steps)
   - [Local Development](#local-development)
   - [Environment Variables](#environment-variables)
   - [Production / CI/CD](#production--cicd)
5. [Service Endpoints](#service-endpoints)

--------------------------------------------------

## 1 Overview
This backend consists of:

- **API Gateway**: Central entry point, handles routing, JWT verification, CORS, Idempotency-Key and X-Correlation-Id.
- **Microservices**:
  - `auth-service` → user registration, authentication, JWT issuance.
  - `balance-service` → manages user balances.
  - `operation-service` → executes operations (add, subtract, etc.).
  - `record-service` → stores operation results and hadles export records file to AWS S3 Bucket and retrieve file from AWS S3 Bucket.
- **Database**: PostgreSQL (`calculator_db`) for all services.(The architecture originaly had each DB per service, this was changed due RENDER platform just allows one DB instance).

**Communication flow**:
Frontend  --> API Gateway --> Microservices --> PostgreSQL

--------------------------------------------------

## 2 Migrations
**Install dependencies** (example using Sequelize for Node.js):
npm install sequelize-cli pg pg-hstore

**Generate migration** example for `users`:
npx sequelize-cli model:generate --name User --attributes username:string,password:string

**Run migrations**:
npx sequelize-cli db:migrate

> Repeat migrations for each microservice with its respective models.

--------------------------------------------------

## 3 Seed Data
**Auth Service**
- Create initial user:  
{
  "username": "test@example.com",
  "password": "Test1234"
}

**Balance Service**
- Initial user balance: `20 credits`

**Operation Service**
- Default operations: `addition`, `subtraction`, `multiplication`, `division`, `square_root`,`random_string`

**Record Service**
- Table empty at initialization.

**Seed commands**:
npx sequelize-cli db:seed:all

--------------------------------------------------

## 4 Rolling Deploy Steps, you can run the app locally and using Docker (Both instructions below) 

## How to run with Docker
1. Run Local with DOCKER Deployment
**NOTE: Please refer to docker-compose.yml file for a full information**
version: "3.8"
  frontend:
      build: ../frontend
      ports:
        - "5173:80"   # host:container
      networks:
        - app-network
      depends_on:
        - api-gateway

    api-gateway:
      build: ./api-gateway
      container_name: api-gateway
      ports:
        - "8080:8080"
      env_file:
        - ./api-gateway/.env.docker  
      networks:
        - app-network
      depends_on:
        - auth-service
        - balance-service
        - operation-service
        - record-service

    auth-service:
      build: ./auth-service
      container_name: auth-service
      ports:
        - "4000:4000"
      env_file:
        - ./auth-service/.env.docker  
      networks:
        - app-network
      environment:
        DATABASE_URL: postgres://postgres:postgres@postgres:5432/calculator
      depends_on:
        - postgres
        - minio

    balance-service:
      build: ./balance-service
      container_name: balance-service
      ports:
        - "4003:4003"
      env_file:
        - ./balance-service/.env.docker  
      networks:
        - app-network
      environment:
        DATABASE_URL: postgres://postgres:postgres@postgres:5432/calculator
      depends_on:
        - postgres

    operation-service:
      build: ./operation-service
      container_name: operation-service
      ports:
        - "4001:4001"
      env_file:
        - ./operation-service/.env.docker  
      networks:
        - app-network
      environment:
        DATABASE_URL: postgres://postgres:postgres@postgres:5432/calculator
      depends_on:
        - postgres
        - balance-service
        - record-service

    record-service:
      build: ./record-service
      container_name: record-service
      ports:
        - "4002:4002"
      env_file:
        - ./record-service/.env.docker  
      networks:
        - app-network
      environment:
        DATABASE_URL: postgres://postgres:postgres@postgres:5432/calculator
      depends_on:
        - postgres

 ## Go to api-gateway service and create file  `.env.docker`
     PORT=8080
     JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
     AUTH_SERVICE=http://auth-service:4000
     OPERATION_SERVICE=http://operation-service:4001
     RECORD_SERVICE=http://record-service:4002
     BALANCE_SERVICE=http://balance-service:4003
     DEV_APPLICATION=http://localhost:5173
     PROD_APPLICATION=https://calculator-seven-wine-91.vercel.app
  
  ## Go to auth-service and create file `.env.docker`
     PORT=4000
     DATABASE_URL=postgres://postgres:postgres@postgres:5432/calculator
      DB_NAME=calculator
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_HOST=postgres
      NODE_ENV=production
      LOG_LEVEL=info
      BALANCE_SERVICE=http://balance-service:4003
      JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=

   ## Go to balance-service and create file `.env.docker`
      PORT=4003
      DATABASE_URL=postgres://postgres:postgres@postgres:5432/calculator
      DB_NAME=calculator
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_HOST=postgres
      NODE_ENV=production
      JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=

   ## Go to operation-service and create file `.env.docker`
      PORT=4001
      DATABASE_URL=postgres://postgres:postgres@postgres:5432/calculator
      DB_NAME=calculator
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_HOST=postgres
      NODE_ENV=production
      RECORD_SERVICE=http://record-service:4002
      BALANCE_SERVICE=http://balance-service:4003
      JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=

   ## Go to record-service and create file `.env.docker`
      PORT=4002
      DATABASE_URL=postgres://postgres:postgres@postgres:5432/calculator
      DB_NAME=calculator
      DB_USER=postgres
      DB_PASSWORD=postgres
      DB_HOST=postgres
      NODE_ENV=production
      JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
      AWS_CONFIGURATION=For AWS Configuration please contact to owner app: jabraham.ocampo@gmail.com 
     
## Deploy Steps:
1. Go to you local backend repository
2. Execute command: docker-compose build
3. Execute command: docker-compose up -d
4. Docker container is serving the application at: http://localhost:5173/register
5. Application is runing now!

## How to Run Local Development
   - Installation & Local Setup
   - Prerequisites:
   - Node.js v18+
   - PostgreSQL
   - npm

1. Clone the repository: git clone https://github.com/jabrahamocampo/calculator-backend.git
  - Create a .env file in each service with the required environment variables.

    ## Environment Variables
    ### Go to api-gateway and create `.env`
    PORT=8080
    JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
    AUTH_SERVICE=http://localhost:4000
    OPERATION_SERVICE=http://localhost:4001
    RECORD_SERVICE=http://localhost:4002
    BALANCE_SERVICE=http://localhost:4003
    DEV_APPLICATION=http://localhost:5173
    DEV_API_GATEWAY=http://localhost:8080
    PROD_APPLICATION=https://calculator-seven-wine-91.vercel.app

    ### Go to Auth Service and create `.env` 
    PORT=4000
    DATABASE_URL=postgres://calc_user:calc_pass@localhost:5432/calculator_db
    JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
    DB_HOST=localhost
    NODE_ENV=development
    LOG_LEVEL=info
    BALANCE_SERVICE=http://localhost:4003

    ### Go to Operation Service abd create `.env`
    PORT=4001
    DATABASE_URL=postgres://calc_user:calc_pass@localhost:5432/calculator_db
    JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
    DB_HOST=localhost
    NODE_ENV=development
    RECORD_SERVICE=http://localhost:4002
    BALANCE_SERVICE=http://localhost:4003

    ### Go to Record Service and create `.env`
    PORT=4002
    DATABASE_URL=postgres://calc_user:calc_pass@localhost:5432/calculator_db
    JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
    DB_HOST=localhost
    NODE_ENV=development
    # AWS S3 Config
    AWS_CONFIGURATION=For AWS Configuration please contact to owner app: jabraham.ocampo@gmail.com 

    ### Got to Balance Service and create `.env`
    PORT=4003
    DATABASE_URL=postgres://calc_user:calc_pass@localhost:5432/calculator_db
    JWT_SECRET=bE4MsPRx3xFG1RCOGRiMyvrn6Sd9BS2AGrJRGKdbvHY=
    DB_HOST=localhost
    NODE_ENV=development

2. Create Calculator_db
    -- 2.1. Create user
          DO
          $do$
          BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_catalog.pg_user
                WHERE usename = 'calc_user'
            ) THEN
                CREATE USER calc_user WITH PASSWORD 'calc_pass';
            END IF;
          END
          $do$;

     -- 2.2 Create Database
          CREATE DATABASE calculator_db
              WITH 
              OWNER = calc_user
              ENCODING = 'UTF8'
              LC_COLLATE = 'en_US.UTF-8'
              LC_CTYPE = 'en_US.UTF-8'
              CONNECTION LIMIT = -1;

      -- 2.3. Grant privileges to user
          GRANT ALL PRIVILEGES ON DATABASE calculator_db TO calc_user;
  

3. Start services in order (respect dependencies):
   Start each service: npm run dev
   Start the API Gateway last. 

  Navigate into each service folder and install dependencies:
  # Auth Service
  cd auth-service
  npm install
  npm run start

  # Balance Service
  cd balance-service
  npm install
  npm run start

  # Operation Service
  cd operation-service
  npm install
  npm run start

  # Record Service
  cd record-service
  npm install
  npm run start

  # API Gateway
  cd api-gateway
  npm install
  npm run start

4. Go to: http://localhost:5173/
5. Application is runing now!
--------------------------------------------------
### Production / CI/CD
1. Pull latest changes: git pull origin master
2. Install dependencies: npm ci
3. Run migrations: npx sequelize-cli db:migrate
4. Seed initial data (if needed): npx sequelize-cli db:seed:all
5. Restart services: pm2 restart all  # Or Docker container restart
---------------------------------------------------
## 5 Service Endpoints (summary)
| Service | Endpoint | Method | Notes |
|---------|----------|--------|-------|
| Auth | `/api/v1/auth/register` | POST | Create new user |
| Auth | `/api/v1/auth/login` | POST | Get JWT token |
| Balance | `/api/v1/balance/:userId` | GET | Check user balance |
| Operation | `/api/v1/operations/execute` | POST | Execute operation |
| Record | `/api/v1/records` | GET | List records |
| Record | `/api/v1/records` | POST | Create record |
| Record | `/api/v1/records/:recordId` | DELETE | Soft delete record |
| Record | `/api/v1/records/export/:userId` | GET | Export user records to AWS S3 |
---------------------------------------------------
![Backend CI](https://github.com/jabrahamocampo/calculator-backend/actions/workflows/backend-ci.yml/badge.svg)

---------------------------------------------------
## 6 Wanna see contract first? Check OpenAPI (Swagger) Full Stack Calculator Microservices APIs :D
http://localhost:8080/docs/#/

--------------------------------------------------------------------------
## 7. Wanna run some tests? Please follow the instruction:
- Unit Test: Unit test has been implemented to all services in the backend's application:
    api-gatgeway, auth-service, operation-service and record-service
    In order to execute unit test and execute test coverage in each microservice do the following:
    1.- Go to root each service directory for example: cd backend/auth-service
    2.- Execute command: npm run test
    3.- Execute command: npm run test:coverage 

- Smoke Test: A quick, basic test to check that the most critical functionalities of the application are working.
              In order to run this smoke test please refer to RUNBOOK.md file in frontend repository.
              
- End-to-end (E2E): This test verifies the complete workflow of the application from start to finish, ensuring all  integrated components work together as expected. In order to run this E2E test please refer to RUNBOOK.md file in frontend repository.
--------------------------------------------------------------------------



