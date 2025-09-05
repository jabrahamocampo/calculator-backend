import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const IdempotencyKey = sequelize.define('IdempotencyKey', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  idempotencyKey: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'idempotency_key',
  },
  result: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
  },
}, {
  tableName: 'idempotency_keys',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'idempotency_key'],
      name: 'idempotency_keys_user_id_idempotency_key_key',
    },
  ],
});

export default IdempotencyKey;
