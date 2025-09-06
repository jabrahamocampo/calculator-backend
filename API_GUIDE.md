# API Guide

This guide provides an overview of the available endpoints across all microservices in the project.

---

## Auth Service

### Register User
- **POST** `/api/auth/register`
- **Body:** `{ "username": "string", "password": "string" }`
- **Response:** `201 Created`, user object

### Login User
- **POST** `/api/auth/login`
- **Body:** `{ "username": "string", "password": "string" }`
- **Response:** `200 OK`, `{ "token": "jwt" }`

### Get User Profile
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`, user profile

---

## Operation Service

### Execute Operation
- **POST** `/api/operations/execute`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "type": "addition", "values": [1, 2] }`
- **Response:** `200 OK`, operation result

### Get Operations
- **GET** `/api/operations`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`, list of operations

---

## Record Service

### Create Record
- **POST** `/api/records`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "operationId": "uuid", "result": "number" }`
- **Response:** `201 Created`, record object

### Get User Records
- **GET** `/api/records/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`, list of records

### Soft Delete Record
- **DELETE** `/api/records/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`, confirmation message

---

## Balance Service

### Create User Balance
- **POST** `/api/balance`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "userId": "uuid" }`
- **Response:** `201 Created`, balance object

### Get User Balance
- **GET** `/api/balance/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`, balance object

### Update User Balance
- **PUT** `/api/balance/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "balance": "number" }`
- **Response:** `200 OK`, updated balance object

---

## Notes
- All services require **JWT authentication** via `Authorization: Bearer <token>` unless specified otherwise.
- Idempotency can be enforced on `POST` endpoints via the `Idempotency-Key` header.
