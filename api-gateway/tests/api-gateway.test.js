const request = require("supertest");
const express = require("express");
const axios = require("axios");
require("dotenv").config();

jest.mock("axios");

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());

  // Mock variables
  process.env.AUTH_SERVICE = "http://auth-service";
  process.env.OPERATION_SERVICE = "http://operation-service";
  process.env.RECORD_SERVICE = "http://record-service";
  process.env.BALANCE_SERVICE = "http://balance-service";

  // forwardRequest auxiliar funtion API Gateway
  async function forwardRequest(serviceUrl, method, path, req, res) {
    try {
      const response = await axios({
        method,
        url: `${serviceUrl}${path}`,
        data: req.body,
        params: req.query,
        headers: {
          "Content-Type": req.headers["content-type"] || "application/json",
          Authorization: req.headers["authorization"],
          "Idempotency-Key": req.headers["idempotency-key"],
          "X-Correlation-Id": req.headers["x-correlation-id"],
          "X-User-Id": req.headers["x-user-id"],
        },
      });
      res.status(response.status).json(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { error: "Error en API Gateway" });
    }
  }

  // API Gateway Routes
  app.post("/api/v1/auth/register", (req, res) =>
    forwardRequest(process.env.AUTH_SERVICE, "post", "/register", req, res)
  );
  app.post("/api/v1/auth/login", (req, res) =>
    forwardRequest(process.env.AUTH_SERVICE, "post", "/login", req, res)
  );

  app.get("/api/v1/operations/list", (req, res) =>
    forwardRequest(process.env.OPERATION_SERVICE, "get", "/list", req, res)
  );
  app.post("/api/v1/operations/execute", (req, res) =>
    forwardRequest(process.env.OPERATION_SERVICE, "post", "/execute", req, res)
  );

  app.get("/api/v1/records", (req, res) =>
    forwardRequest(process.env.RECORD_SERVICE, "get", "/", req, res)
  );
  app.post("/api/v1/records", (req, res) =>
    forwardRequest(process.env.RECORD_SERVICE, "post", "/", req, res)
  );
  app.delete("/api/v1/records/:id", (req, res) =>
    forwardRequest(process.env.RECORD_SERVICE, "delete", `/${req.params.id}`, req, res)
  );
  app.get("/api/v1/records/export", (req, res) =>
    forwardRequest(process.env.RECORD_SERVICE, "get", "/export", req, res)
  );

  app.get("/api/v1/balance/:userId", (req, res) =>
    forwardRequest(process.env.BALANCE_SERVICE, "get", `/${req.params.userId}`, req, res)
  );
  app.post("/api/v1/balance/", (req, res) =>
    forwardRequest(process.env.BALANCE_SERVICE, "post", "/", req, res)
  );
  app.put("/api/v1/balance/", (req, res) =>
    forwardRequest(process.env.BALANCE_SERVICE, "put", `/${req.body.userId}`, req, res)
  );
});

describe("API Gateway full routes", () => {
  afterEach(() => jest.clearAllMocks());

  // ---------------- AUTH ----------------
  it("POST /api/v1/auth/register forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 201, data: { message: "User created" } });

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", "Bearer token123")
      .set("Idempotency-Key", "abc-123-idempotency")
      .set("X-Correlation-Id", "corr-1")
      .set("X-User-Id", "user-1")
      .send({ email: "test@test.com", password: "123456" });

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "post",
      url: `${process.env.AUTH_SERVICE}/register`,
      data: { email: "test@test.com", password: "123456" },
      headers: expect.objectContaining({
        Authorization: "Bearer token123",
        "Idempotency-Key": "abc-123-idempotency",
        "X-Correlation-Id": "corr-1",
        "X-User-Id": "user-1",
      })
    }));

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "User created" });
  });

  it("POST /api/v1/auth/login forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 200, data: { token: "jwt-token" } });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Authorization", "Bearer tokenABC")
      .set("Idempotency-Key", "login-123")
      .set("X-Correlation-Id", "corr-login")
      .set("X-User-Id", "user-2")
      .send({ email: "test@test.com", password: "123456" });

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "post",
      url: `${process.env.AUTH_SERVICE}/login`,
      headers: expect.objectContaining({
        Authorization: "Bearer tokenABC",
        "Idempotency-Key": "login-123",
        "X-Correlation-Id": "corr-login",
        "X-User-Id": "user-2",
      })
    }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ token: "jwt-token" });
  });

  // ---------------- OPERATIONS ----------------
  it("GET /api/v1/operations/list forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 200, data: [{ type: "addition", cost: 10 }] });

    const res = await request(app)
      .get("/api/v1/operations/list")
      .set("Authorization", "Bearer op-123")
      .set("Idempotency-Key", "op-456")
      .set("X-Correlation-Id", "corr-op")
      .set("X-User-Id", "user-3");

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "get",
      url: `${process.env.OPERATION_SERVICE}/list`,
      headers: expect.objectContaining({
        Authorization: "Bearer op-123",
        "Idempotency-Key": "op-456",
        "X-Correlation-Id": "corr-op",
        "X-User-Id": "user-3",
      })
    }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ type: "addition", cost: 10 }]);
  });

  it("POST /api/v1/operations/execute forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 200, data: { result: 15 } });

    const res = await request(app)
      .post("/api/v1/operations/execute")
      .set("Authorization", "Bearer op-999")
      .set("Idempotency-Key", "exec-123")
      .set("X-Correlation-Id", "corr-exec")
      .set("X-User-Id", "user-4")
      .send({ type: "addition", a: 10, b: 5 });

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "post",
      url: `${process.env.OPERATION_SERVICE}/execute`,
      data: { type: "addition", a: 10, b: 5 },
      headers: expect.objectContaining({
        Authorization: "Bearer op-999",
        "Idempotency-Key": "exec-123",
        "X-Correlation-Id": "corr-exec",
        "X-User-Id": "user-4",
      })
    }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ result: 15 });
  });

  // ---------------- RECORDS ----------------
  it("POST /api/v1/records forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 201, data: { message: "Record created" } });

    const res = await request(app)
      .post("/api/v1/records")
      .set("Authorization", "Bearer rec-1")
      .set("Idempotency-Key", "rec-123")
      .set("X-Correlation-Id", "corr-rec")
      .set("X-User-Id", "user-5")
      .send({ type: "addition", value: 10 });

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "post",
      url: `${process.env.RECORD_SERVICE}/`,
      data: { type: "addition", value: 10 },
      headers: expect.objectContaining({
        Authorization: "Bearer rec-1",
        "Idempotency-Key": "rec-123",
        "X-Correlation-Id": "corr-rec",
        "X-User-Id": "user-5",
      })
    }));

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Record created" });
  });

  it("DELETE /api/v1/records/:id forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 200, data: { message: "Record deleted" } });

    const res = await request(app)
      .delete("/api/v1/records/10")
      .set("Authorization", "Bearer rec-del")
      .set("Idempotency-Key", "rec-del-123")
      .set("X-Correlation-Id", "corr-rec-del")
      .set("X-User-Id", "user-6");

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "delete",
      url: `${process.env.RECORD_SERVICE}/10`,
      headers: expect.objectContaining({
        Authorization: "Bearer rec-del",
        "Idempotency-Key": "rec-del-123",
        "X-Correlation-Id": "corr-rec-del",
        "X-User-Id": "user-6",
      })
    }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Record deleted" });
  });

  // ---------------- BALANCE ----------------
  it("PUT /api/v1/balance/ forwards headers correctly", async () => {
    axios.mockResolvedValue({ status: 200, data: { message: "Balance updated" } });

    const res = await request(app)
      .put("/api/v1/balance/")
      .set("Authorization", "Bearer bal-1")
      .set("Idempotency-Key", "bal-123")
      .set("X-Correlation-Id", "corr-bal")
      .set("X-User-Id", "user-7")
      .send({ userId: 7, balance: 150 });

    expect(axios).toHaveBeenCalledWith(expect.objectContaining({
      method: "put",
      url: `${process.env.BALANCE_SERVICE}/7`,
      data: { userId: 7, balance: 150 },
      headers: expect.objectContaining({
        Authorization: "Bearer bal-1",
        "Idempotency-Key": "bal-123",
        "X-Correlation-Id": "corr-bal",
        "X-User-Id": "user-7",
      })
    }));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Balance updated" });
  });
});
