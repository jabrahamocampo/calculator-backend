
import sequelize from './config/database.js';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT || 4002;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`Record Service escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al conectar:', err);
  }
}

startServer();
