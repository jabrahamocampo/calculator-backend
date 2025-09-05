import { registerUser, loginUser } from "../src/services/auth.service.js";
import ApiError from "../src/errors/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../src/models/User.js";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("axios");
jest.mock("../src/models/User.js");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.BALANCE_SERVICE = "http://balance-service";
  });

  it("registerUser creates a new user and calls balance service", async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed_pw");
    User.create.mockResolvedValue({ id: 1, username: "spock" });
    axios.post.mockResolvedValue({ status: 200 });

    const user = await registerUser("spock", "pw123", "corr-1");

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: "spock" } });
    expect(User.create).toHaveBeenCalledWith({ username: "spock", password: "hashed_pw" });
    expect(axios.post).toHaveBeenCalledWith(
      "http://balance-service",
      { userId: 1 },
      expect.objectContaining({ headers: {"Content-Type": "application/json", "x-correlation-id": "corr-1"}})
    );
    expect(user).toEqual({ id: 1, username: "spock" });
  });

  it("registerUser it shows a message if the user already exists", async () => {
    User.findOne.mockResolvedValue({ id: 1, username: "spock" });

    await expect(registerUser("spock", "pw123")).rejects.toEqual(
      ApiError.badRequest("User already exist")
    );
  });

  it("loginUser returns a valid token if credentials are correct", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      username: "spock",
      password: "hashed_pw",
      status: "active",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fake-jwt");

    const result = await loginUser("spock", "pw123");

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: "spock" } });
    expect(bcrypt.compare).toHaveBeenCalledWith("pw123", "hashed_pw");
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, username: "spock" },
      "test_secret",
      { expiresIn: "1h" }
    );
    expect(result).toEqual({ token: "fake-jwt" });
  });

  it("loginUser shows an error if credentials are incorrect", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      username: "spock",
      password: "hashed_pw",
      status: "active",
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(loginUser("spock", "badpw")).rejects.toEqual(
      ApiError.badRequest("Error validating credentials")
    );
  });

  it("loginUser shows an error if the user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(loginUser("unknown", "pw123")).rejects.toEqual(
      ApiError.notFound("User not found")
    );
  });

  it("loginUser shows an error if the user is inactive", async () => {
    User.findOne.mockResolvedValue({
      id: 2,
      username: "kirk",
      password: "hashed_pw",
      status: "inactive",
    });

    await expect(loginUser("kirk", "pw123")).rejects.toEqual(
      ApiError.badRequest("Inactive account")
    );
  });
});
