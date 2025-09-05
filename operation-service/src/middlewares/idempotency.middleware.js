import sequelize from '../config/database.js';

export async function idempotencyMiddleware(req, res, next) {

  const key = req.headers['idempotency-key'];
  
  if (!key) {
    return res.status(400).json({ error: 'Idempotency-Key required' });
  }

  if (!req.user) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  const userId = req.user.id; //It comes from JWT

 const rows = await sequelize.query(
  `SELECT result FROM idempotency_keys 
   WHERE user_id = :userId AND idempotency_key = :key AND expires_at > NOW()`,
  {
    replacements: { userId, key },
    type: sequelize.QueryTypes.SELECT
  }
);

  if (rows.length > 0) {
    return res.status(200).json(rows[0].response);
  }

  // Save initial key
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

  await sequelize.query(
    `INSERT INTO idempotency_keys (user_id, idempotency_key, expires_at)
    VALUES (:userId, :key, :expiresAt)`,
    {
        replacements: { userId, key, expiresAt },
        type: sequelize.QueryTypes.RAW
    }
   );


  next();
}

