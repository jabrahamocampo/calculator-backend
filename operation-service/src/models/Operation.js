import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Operation = sequelize.define('Operation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM(
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'square_root',
      'random_string'
    ),
    allowNull: false,
  },
  cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'operations',
  timestamps: true,
});

export default Operation;
