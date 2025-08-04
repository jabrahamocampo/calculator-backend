import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
//import User from './User.js';

const Record = sequelize.define('Record', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  operation_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_balance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  operation_response: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'records',
  timestamps: true,
  paranoid: true, // Sequelize maneja soft delete automáticamente con deletedAt
});

//User.hasMany(Record, { foreignKey: 'user_id' });
//Record.belongsTo(User, { foreignKey: 'user_id' });

export default Record;
