import { db } from './src/config/firebase.js';
import app from './src/app.js';
import sequelize from './src/config/database.js';
import { env } from './src/config/env.js';
// 2. Importa las asociaciones para que Sequelize registre las relaciones
// Esto debe ocurrir antes del sync()
//import './src/models/associations.js';

const PORT = env.API_PORT || 3000;

const startServer = async () => {
    try {
        // 3. Autenticar
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida.');

        if (env.ENVIRONMENT === 'development') {
            // 4. Sincronización explícita
            // Nota: Usar { alter: true } es correcto para desarrollo, 
            await sequelize.sync({ alter: true });
            console.log('✅ Modelos sincronizados.');
        }

        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:');
        console.error(error);
        process.exit(1);
    }
};

if (env.ENVIRONMENT === 'development') {
    startServer();
}