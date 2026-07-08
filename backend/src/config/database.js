import 'mysql2';
import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(env.DB_URI, {
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export default sequelize;