import { Sequelize } from 'sequelize';
import { env } from './env.js';

const sequelize = new Sequelize(env.DB_URI, {
    dialect: 'mysql',
    logging: false
});

export default sequelize;