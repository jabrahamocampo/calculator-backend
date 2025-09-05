import { createUserBalance, getUserBalance, updateUserBalance } from '../src/services/balance.service.js';
import UserBalance from '../src/models/UserBalance.js';
import ApiError from '../src/errors/ApiError.js';

jest.mock('../src/models/UserBalance.js');

describe("Balance Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserBalance", () => {
    it("should create a new user balance if not existing", async () => {
      UserBalance.findOne.mockResolvedValue(null);
      UserBalance.create.mockResolvedValue({ user_id: 1, balance: 20 });

      const result = await createUserBalance(1);

      expect(UserBalance.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
      expect(UserBalance.create).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual({ user_id: 1, balance: 20 });
    });

    it("should throw an error if user balance already exists", async () => {
      UserBalance.findOne.mockResolvedValue({ user_id: 1, balance: 20 });

      await expect(createUserBalance(1)).rejects.toThrow(ApiError);
      await expect(createUserBalance(1)).rejects.toThrow("User balance already exists");
    });
  });

  describe("getUserBalance", () => {
    it("should return the user balance if found", async () => {
      const mockBalance = { user_id: 2, balance: 50 };
      UserBalance.findOne.mockResolvedValue(mockBalance);

      const result = await getUserBalance(2);

      expect(UserBalance.findOne).toHaveBeenCalledWith({ where: { user_id: 2 } });
      expect(result).toEqual(mockBalance);
    });

    it("should throw not found if balance does not exist", async () => {
      UserBalance.findOne.mockResolvedValue(null);

      await expect(getUserBalance(999)).rejects.toThrow(ApiError);
      await expect(getUserBalance(999)).rejects.toThrow("User not found");
    });
  });

  describe("updateUserBalance", () => {
    it("should update and return the balance if user exists", async () => {
      const mockBalance = { user_id: 3, balance: 20, save: jest.fn().mockResolvedValue(true) };
      UserBalance.findOne.mockResolvedValue(mockBalance);

      const result = await updateUserBalance(3, 100);

      expect(UserBalance.findOne).toHaveBeenCalledWith({ where: { user_id: 3 } });
      expect(mockBalance.balance).toBe(100);
      expect(mockBalance.save).toHaveBeenCalled();
      expect(result).toEqual(mockBalance);
    });

    it("should throw not found if user balance does not exist", async () => {
      UserBalance.findOne.mockResolvedValue(null);

      await expect(updateUserBalance(999, 100)).rejects.toThrow(ApiError);
      await expect(updateUserBalance(999, 100)).rejects.toThrow("User not found");
    });
  });
});
