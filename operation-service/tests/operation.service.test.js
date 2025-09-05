import { listOperations, executeOperation } from "../src/services/operation.service.js";
import Operation from "../src/models/Operation.js";
import ApiError from "../src/errors/ApiError.js";
import axios from "axios";

jest.mock("../src/models/Operation.js");
jest.mock("axios");

describe("Operation Service", () => {
  const mockUserId = 1;
  const mockToken = "Bearer testtoken";
  const mockCorrelationId = "corr-123";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RECORD_SERVICE = "http://fake-record-service";
    process.env.BALANCE_SERVICE = "http://fake-balance-service";
  });

  // ----------- listOperations -----------
  describe("listOperations", () => {
    it("should return all operations", async () => {
      const mockOps = [{ type: "addition", cost: 1 }];
      Operation.findAll.mockResolvedValue(mockOps);

      const result = await listOperations();

      expect(Operation.findAll).toHaveBeenCalledWith({ attributes: ["type", "cost"] });
      expect(result).toEqual(mockOps);
    });

    it("should throw not found if no operations exist", async () => {
      Operation.findAll.mockResolvedValue(null);

      await expect(listOperations()).rejects.toThrow(ApiError);
      await expect(listOperations()).rejects.toThrow("Operations not found");
    });
  });

  // ----------- executeOperation -----------
  describe("executeOperation", () => {
    it("should execute addition and update balance", async () => {
      Operation.findOne.mockResolvedValue({ type: "addition", cost: 1 });
      axios.get.mockResolvedValue({ data: { balance: 10 } });
      axios.post.mockResolvedValue({ status: 200 });
      axios.put.mockResolvedValue({ status: 200 });

      const result = await executeOperation(
        "addition",
        [2, 3],
        mockUserId,
        mockToken,
        mockCorrelationId
      );

      expect(Operation.findOne).toHaveBeenCalledWith({ where: { type: "addition" } });
      expect(result).toEqual({ result: "5.00", cost: 1, newBalance: 9 });
    });

    it("should throw error if operands are invalid", async () => {
      Operation.findOne.mockResolvedValue({ type: "addition", cost: 1 });
      axios.get.mockResolvedValue({ data: { balance: 10 } });

      await expect(
        executeOperation("addition", ["a", 2], mockUserId, mockToken, mockCorrelationId)
      ).rejects.toThrow("All operands must be valid numbers. Please try again.");
    });

    it("should throw insufficient balance error", async () => {
      Operation.findOne.mockResolvedValue({ type: "addition", cost: 50 });
      axios.get.mockResolvedValue({ data: { balance: 10 } });

      await expect(
        executeOperation("addition", [1, 2], mockUserId, mockToken, mockCorrelationId)
      ).rejects.toThrow("Insufficient balance");
    });

    it("should handle division by zero", async () => {
      Operation.findOne.mockResolvedValue({ type: "division", cost: 1 });
      axios.get.mockResolvedValue({ data: { balance: 10 } });

      await expect(
        executeOperation("division", [10, 0], mockUserId, mockToken, mockCorrelationId)
      ).rejects.toThrow("Cannot divide by zero. Please enter a different divisor.");
    });

    it("should handle square root of negative number", async () => {
      Operation.findOne.mockResolvedValue({ type: "square_root", cost: 1 });
      axios.get.mockResolvedValue({ data: { balance: 10 } });

      await expect(
        executeOperation("square_root", [-9], mockUserId, mockToken, mockCorrelationId)
      ).rejects.toThrow("Square root of negative numbers is not allowed. Please try with positive number.");
    });

    it("should throw if operation not found", async () => {
      Operation.findOne.mockResolvedValue(null);

      await expect(
        executeOperation("unknown_op", [1, 2], mockUserId, mockToken, mockCorrelationId)
      ).rejects.toThrow("Invalid Operation");
    });
  });
});
