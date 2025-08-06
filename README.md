# Calculator Backend – Microservices Architecture

This repository contains the backend implementation of the **Calculator App**, deployed with a **microservices architecture**.  
The application is live at: **https://calculator-seven-wine-91.vercel.app**

---

## 1. Live Version
- **Frontend**: Implemented as a **Single Page Application (SPA)** for seamless navigation without full page reloads.  
- **Backend**: Fully implemented using a **microservices architecture**:
  - **API Gateway**
  - **Auth Service**
  - **Operation Service**
  - **Record Service**
  - **Balance Service**
- **Advantages**:
  - Scalability: Each service can be deployed and scaled independently.
  - Maintainability: Each service has its own codebase and responsibilities.
  - Decoupling: Reduces dependencies between modules.
- **Demo Credentials**:
  - Email: `test@example.com`
  - Password: `Test1234`
- **Balance Note**:
  - The user `test@example.com` has already performed **two operations**, so their current balance is **18** instead of **20**.
  - New users will start with a balance of **20** as per the requirement.

---

## 2. Code Quality
- Follows **code conventions**, clear separation of concerns, and consistent naming.
- Implements **design patterns** such as the **Gateway pattern** and **Service per Database** (adapted due to hosting constraints).
- **Important**: Originally, each microservice had its own PostgreSQL database.  
  However, Render's free tier allows only one database, so the architecture was adapted to use a shared database instance.

---

## 3. Automated Tests
- End-to-end (E2E) and integration tests are being prepared.
- **Coverage** will be published soon and uploaded to the repository.

---

## 4. Web Security
- Implements **JWT-based authentication** to protect private routes.
- Uses **middleware for authorization** in backend services.
- CORS policies configured to allow only trusted origins.
- Sanitization of inputs to prevent injection attacks.

---

## 5. API Design
- RESTful API design with consistent versioning (`/api/v1`).
- API Gateway routes requests to the corresponding microservices.
- Each service exposes only its own endpoints.
- Clear separation of read and write operations.

---

## Plus Features
- **AWS S3 Integration**:
  - Users can export their operation history to a `.json` file stored in S3.
  - A download link is provided to view or download the file.
- Fully deployed in the cloud using **Render** (backend) and **Vercel** (frontend).

---

## Important Note
> **Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more.**  
> This is due to Render's free tier limitations.

---

## Technologies Used
- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **AWS S3 SDK**
- **Vercel** (Frontend hosting)
- **Render** (Backend hosting)

---

## Project Structure
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│             │     │               │     │                  │
│   Frontend  │────>│  API Gateway  │────>│  Auth Service    │
│  (Vercel)   │     │  (Render)     │     │                  │
│             │     │               │     └──────────────────┘
└─────────────┘     └───────┬───────┘     ┌──────────────────┐
                            │             │                  │
                            │────────────>│  Balance Service │
                            │             │                  │
                            │             └──────────────────┘
                            │             ┌──────────────────┐
                            │             │                  │
                            │────────────>│ Operation Service│
                            │             │                  │
                            │             └──────────────────┘
                            │             ┌──────────────────┐
                            │             │                  │
                            └────────────>│  Record Service  │
                                          │                  │
                                          └──────────────────┘


| Service           | Description                                   | Production URL           
| ----------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| API Gateway       | Entry point that routes requests to services. | [https://calculator-backend-api-gateway.onrender.com]
| Auth Service      | Handles user registration, login, and JWT.    | https://calculator-backend-auth-service-1.onrender.com
| Operation Service | Handles mathematical operations.              | [https://calculator-backend-operation-service.onrender.com]
| Balance Service   | Manages user balances.                        | [https://calculator-backend-balance-service.onrender.com]
| Record Service    | Stores and retrieves user operation history.  | [https://calculator-backend-record-service.onrender.com]



---

## How to Run Locally

Installation & Local Setup
Prerequisites:
Node.js v18+
PostgreSQL
npm

1. Clone the repository: git clone https://github.com/jabrahamocampo/calculator-backend.git

Navigate into each service folder and install dependencies:
cd service-name
npm install

Create a .env file in each service with the required environment variables.
PORT=...
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
JWT_SECRET=...


Start each service: npm run dev

Start the API Gateway last.


