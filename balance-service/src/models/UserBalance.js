import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserBalance = sequelize.define('UserBalance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // One unique user
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 20.0, // Initial Balance
  },
}, {
  tableName: 'user_balances',
  timestamps: true,
});

export default UserBalance;
