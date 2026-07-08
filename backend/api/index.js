import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import '../src/models/associations.js';

await sequelize.authenticate();

export default app;