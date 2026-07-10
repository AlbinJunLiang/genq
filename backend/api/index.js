import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import '../src/models/associations.js';

let dbReady = false;

async function initDatabase() {
  if (!dbReady) {
    try {
      await sequelize.authenticate();
      dbReady = true;
      console.log('✅ Base de datos conectada');
    } catch (err) {
      console.error('❌ Error conectando a la base de datos:', err.message);
      // no relanzamos: dejamos que la función siga viva
    }
  }
}

await initDatabase();

export default app;