import {
  performOperationForUser,
  getRecordsByUserId,
  getUserRecords,
  softDeleteRecord
} from "../src/services/record.service.js";
import Record from "../src/models/Record.js";
import ApiError from "../src/errors/ApiError.js";
import { Op } from "sequelize";

jest.mock("../src/models/Record.js");

describe("Record Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------- performOperationForUser -----------
  describe("performOperationForUser", () => {
    it("should create a new record successfully", async () => {
      const mockRecord = { id: 1, toJSON: () => ({ id: 1 }) };
      Record.create.mockResolvedValue(mockRecord);

      const result = await performOperationForUser({
        operation_type: "addition",
        amount: 10,
        user_balance: 100,
        operation_response: "42",
        user_id: 1
      });

      expect(Record.create).toHaveBeenCalledWith({
        operation_type: "addition",
        amount: 10,
        user_balance: 100,
        operation_response: "42",
        user_id: 1
      });
      expect(result).toEqual({ record: mockRecord });
    });

    it("should throw error if record creation fails", async () => {
      Record.create.mockResolvedValue(null);

      await expect(
        performOperationForUser({
          operation_type: "addition",
          amount: 10,
          user_balance: 100,
          operation_response: "42",
          user_id: 1
        })
      ).rejects.toThrow("Operation not registered.");
    });
  });

  // ----------- getRecordsByUserId -----------
  describe("getRecordsByUserId", () => {
    it("should return formatted records", async () => {
      const mockRecord = {
        createdAt: new Date("2025-08-28T10:00:00"),
        updatedAt: new Date("2025-08-28T11:00:00"),
        toJSON: () => ({ id: 1, operation_type: "addition" })
      };
      Record.findAll.mockResolvedValue([mockRecord]);

      const result = await getRecordsByUserId(1);

      expect(Record.findAll).toHaveBeenCalledWith({
        where: { user_id: 1, deleted_at: null },
        order: [["createdAt", "DESC"]],
      });

      expect(result[0]).toEqual({
        id: 1,
        operation_type: "addition",
        createdAt: "08/28/2025 10:00",
        updatedAt: "08/28/2025 11:00"
      });
    });

    it("should throw error if no records found", async () => {
      Record.findAll.mockResolvedValue(null);

      await expect(getRecordsByUserId(1)).rejects.toThrow("Records not found");
    });
  });

  // ----------- getUserRecords -----------
  describe("getUserRecords", () => {
    it("should return paginated and formatted records", async () => {
      const mockRecord = {
        createdAt: new Date("2025-08-28T10:00:00"),
        updatedAt: new Date("2025-08-28T11:00:00"),
        toJSON: () => ({ id: 1, operation_type: "addition" })
      };
      Record.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: [mockRecord]
      });

      const result = await getUserRecords({
        userId: 1,
        page: 1,
        perPage: 10,
        search: "",
        orderBy: "createdAt",
        order: "desc"
      });

      expect(Record.findAndCountAll).toHaveBeenCalledWith({
        where: { user_id: 1, deleted_at: null },
        limit: 10,
        offset: 0,
        order: [["createdAt", "DESC"]],
      });

      expect(result.records[0]).toEqual({
        id: 1,
        operation_type: "addition",
        createdAt: "08/28/2025 10:00",
        updatedAt: "08/28/2025 11:00"
      });
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  // ----------- softDeleteRecord -----------
  describe("softDeleteRecord", () => {
    it("should delete a record successfully", async () => {
      const mockRecord = { destroy: jest.fn() };
      Record.findOne.mockResolvedValue(mockRecord);

      const result = await softDeleteRecord(1, 1);

      expect(Record.findOne).toHaveBeenCalledWith({
        where: { id: 1, user_id: 1 }
      });
      expect(mockRecord.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: "Record successfully deleted" });
    });

    it("should throw error if record not found", async () => {
      Record.findOne.mockResolvedValue(null);

      await expect(softDeleteRecord(1, 1)).rejects.toThrow("Record not found or unauthorized");
    });
  });
});
