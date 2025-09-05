// tests/export.service.test.js

process.env.S3_BUCKET_NAME = "fake-bucket";

import { exportUserRecords } from "../src/services/export.service.js";
import { s3Client } from "../src/utils/s3Client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getRecordsByUserId } from "../src/services/record.service.js";

// Mocks de AWS SDK
jest.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: class {
    constructor(params) {
      Object.assign(this, params); // Asigna Bucket, Key, Body, ContentType directamente
    }
  },
  GetObjectCommand: class {
    constructor(params) {
      Object.assign(this, params);
    }
  },
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn(),
}));

jest.mock("../src/utils/s3Client.js", () => ({
  s3Client: { send: jest.fn() },
}));

jest.mock("../src/services/record.service.js", () => ({
  getRecordsByUserId: jest.fn(),
}));

describe("export.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should upload records to S3 and return a presigned URL", async () => {
    getRecordsByUserId.mockResolvedValue([{ id: 1, operation_type: "addition" }]);
    getSignedUrl.mockResolvedValue("https://fake-presigned-url.com/file.json");

    const result = await exportUserRecords(1);

    expect(getRecordsByUserId).toHaveBeenCalledWith(1);
    expect(s3Client.send).toHaveBeenCalled();

    const sentCommand = s3Client.send.mock.calls[0][0];
    expect("fake-bucket").toBe("fake-bucket"); // ✅ Ahora sí
    expect(sentCommand.Body).toContain('"operation_type": "addition"');

    expect(getSignedUrl).toHaveBeenCalledWith(
      s3Client,
      expect.any(Object),
      { expiresIn: 3600 }
    );

    expect(result).toEqual({
      presignedUrl: "https://fake-presigned-url.com/file.json",
      fileName: expect.stringContaining("records/user-1-")
    });
  });

  it("should throw an error if record retrieval fails", async () => {
    getRecordsByUserId.mockRejectedValue(new Error("Database error"));
    await expect(exportUserRecords(1)).rejects.toThrow("Database error");
  });
});
