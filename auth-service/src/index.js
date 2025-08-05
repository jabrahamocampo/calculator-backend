import dotenv from 'dotenv';
import sequelize from './config/database.js';
import app from './app.js';

dotenv.config();

// ⚠️ En Render, siempre usar el puerto dinámico
//const PORT = process.env.PORT || 4000;
const PORT = process.env.PORT || 10000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Example app listening on port ${PORT}`)
})

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida con éxito.');

    await sequelize.sync({ alter: true });
    console.log('🔄 Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Auth Service escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();
