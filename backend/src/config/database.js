import 'mysql2';
import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(env.DB_URI, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 1,        // 2 sigue siendo riesgoso con un límite gratuito de 2-4 conexiones
    min: 0,
    acquire: 10000, // 30s es mucho tiempo esperando en cola en un entorno serverless
    idle: 1000      // libera la conexión rápido si no se usa
  },
  dialectOptions: {
    connectTimeout: 5000  // falla rápido si no puede ni conectar, en vez de colgar la función
  },
  retry: {
    max: 2   // reintenta un par de veces antes de rendirse
  }
});

export default sequelize;