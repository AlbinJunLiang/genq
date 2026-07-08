import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import '../src/models/associations.js';

let dbReady = false;

async function initDatabase() {
    if (!dbReady) {
        await sequelize.authenticate();
        dbReady = true;
        console.log('✅ Base de datos conectada');
    }
}

await initDatabase();

export default app;