# Full Stack Calculator Microservice Application 

This repository contains the backend implementation of the **Calculator App**, deployed with a **microservices architecture**.  

The production application is live at: **https://calculator-seven-wine-91.vercel.app**

--------------------------------------------------------------

## Features Overview
## Backend (Node.js + Express + Microservices + PostgreSQL)
- Microservices Architecture
- Decoupled services:
    1. Auth Service → Handles registration, login, JWT issuance, and user validation.
    2. Balance Service → Manages user credits, initialization, and updates.
    3. Operation Service → Executes math operations and orchestrates the workflow.
    4. Record Service → Stores operation history with soft delete support.
    5. API Gateway → Unified entry point, routing, header forwarding, and correlation ID propagation.

- Security
    1. JWT Authentication for secure endpoints.
    2. Password Hashing with bcrypt.
    3. Inactive account validation.
    4. x-correlation-id headers for request tracing.

- Reliability & Scalability
   1. Separation of concerns with dedicated services.
   2. Operation Service as orchestrator, validating credits before execution.
   3. Record Service with soft delete for audit history preservation.
   4. Unit, integration, smoke, and E2E tests to ensure stability.
   5. Coverage reports to guarantee code quality.

- Observability & Best Practices
   1. Correlation ID propagation across microservices for traceability.
   2. Clean service, controller, and repository structure.
   3. Centralized error handling with ApiError.
   4. Structured logging for debugging and auditing.

- Testing & QA
   1. Unit Tests: Validation of critical functions (auth.service, math logic, React components).
   2. Integration Tests: End-to-end flow between services (Auth ↔ Balance ↔ Operation ↔ Record).
   3. Smoke Tests: Basic validation of key endpoints after deployment.
   4. E2E Tests: Full simulation of user flow from frontend to backend with database.
   5. Coverage Reports: Ensuring high-quality, maintainable code.

- Infrastructure & DevOps
   1. Docker containerization for all services.
   2. Makefile for simplified build, run, and test commands.
   3. GitHub Actions (CI/CD) with:
   4. Unit, integration, and E2E test execution.
   5. Coverage artifact upload.
   6. README badges for CI and coverage status.
   7. Environment-specific variables for dev, test, and prod.

- AWS S3 Integration:
   1. Secure upload and retrieval of files using signed URLs.
   2. Direct communication between the backend and S3 bucket.
   3. Ensures scalable and reliable storage for user-related assets.

- Client Value
   1. Built with modern, scalable architecture aligned with industry standards.
   2. Robust security with JWT, password hashing, and account validation.
   3. Advanced observability with correlation IDs.
   4. Solid business workflow: authentication, operations execution, dynamic balance management, and historical records.
   5. Responsive and user-friendly frontend, optimized for all devices.
   6. Cloud-ready with Docker, CI/CD, and AWS S3 integration for file storage.

--------------------------------------------------------------

## How to Run Locally. Please refer to RUNBOOK.md file
---
## 1. Live Version Overview
- **Frontend**: Implemented as a **Single Page Application (SPA)** for seamless navigation without full page reloads.  
- **Backend**: Fully implemented using a **microservices architecture**:
  - **API Gateway**
  - **Auth Service**
  - **Operation Service**
  - **Record Service**
  - **Balance Service**
- **PostgreSQL DB**  
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

--------------------------------------------------------------------------
## 2. Code Quality
- Follows **code conventions**, clear separation of concerns, and consistent naming.
- Implements **design patterns** such as the **Gateway pattern, resilience** and **Service per Database** (adapted due to hosting constraints).
- **Important**: Originally, each microservice had its own PostgreSQL database.  
  However, Render's free tier allows only one database, so the architecture was adapted to use a shared database instance.

--------------------------------------------------------------------------
## 3. Tests
- End-to-end (E2E), smoke and unit tests are included.
  Please refer to RUNBOOK.md file
--------------------------------------------------------------------------

## 4. Web Security
- Implements **JWT-based authentication** to protect private routes.
- Uses **middleware for authorization** in backend services.
- CORS policies configured to allow only trusted origins.
- Sanitization of inputs to prevent injection attacks.
- Handling of Idempotency-Key and X-Correlation-Id.

--------------------------------------------------------------------------

## 5. API Design
- RESTful API design with consistent versioning (`/api/v1`).
- API Gateway routes requests to the corresponding microservices.
- Each service exposes only its own endpoints.
- Clear separation of read and write operations.

--------------------------------------------------------------------------

## Plus Features
- **AWS S3 Integration**:
  - Users can export their operation history to a `.json` file stored in AWS S3 Bucket Cloud.
  - A download link is provided to view or download the file.
- Fully deployed in the cloud using **Render** (backend) and **Vercel** (frontend).

--------------------------------------------------------------------------

## Important Note when use the Production Application
> **Your free instance will spin down with inactivity, which can delay requests by 50 seconds or more.**  
> This is due to Render's free tier limitations.

--------------------------------------------------------------------------

## Technologies Used
- **React.js** (Frontend)
- **Node.js** (Backend)
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **AWS S3 SDK**
- **Vercel** (Frontend hosting)
- **Render** (Backend hosting)

--------------------------------------------------------------------------
## Project Architecture 

![Project Architecture](docs/App-Microservices-Arquitecture.png)

┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│             │     │               │     │                  │
│   Frontend  │────>│  API Gateway  │────>│  Auth Service    │
│  (Vercel)   │     │  (Render)     │     │                  │
│             │     │               │     └──────────┬───────┘
└─────────────┘     └───────┬───────┘                │
                            │                        │
                            │───────────>┌─────-─────┴─────────┐
                            │            │  Balance Service    │
                            │            │                     │
                            │            └────────┬────────--──┘
                            │                     │
                            │───────────>┌────────┴──────────┐
                            │            │ Operation Service │
                            │            │                   │
                            │            └──────────┬────────┘
                            │                       │
                            └───────────>┌────---───┴────────┐
                                         │  Record Service   │
                                         │                   │
                                         └──────────┬────────┘
                                                    │
                                                    ▼
                                         ┌──────────────────┐
                                         │  PostgreSQL DB   │
                                         │  calculator_db   │
                                         └──────────────────┘

--------------------------------------------------------------------------
## Production APIs
| Service           | Description                                   | Production URL           
| ----------------- | --------------------------------------------- | --------------------------------------------------------
| API Gateway       | Entry point that routes requests to services. | https://calculator-backend-api-gateway.onrender.com
| Auth Service      | Handles user registration, login, and JWT.    | https://calculator-backend-auth-service-1.onrender.com
| Operation Service | Handles mathematical operations.              | https://calculator-backend-operation-service.onrender.com
| Balance Service   | Manages user balances.                        | https://calculator-backend-balance-service.onrender.com
| Record Service    | Stores and retrieves user operation history.  | https://calculator-backend-record-service.onrender.com


