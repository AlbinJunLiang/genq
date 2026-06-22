import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const QuizAttempt = sequelize.define('QuizAttempt', {
    id:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid:
    {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: {
            name: 'unique_uuid_idx' 
        }
    },
    quiz_attempted_content:
    {
        type: DataTypes.JSON,
        allowNull: true
    },
    score:
    {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    duration_seconds:
    {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status:
    {
        type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'EXPIRED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'IN_PROGRESS'
    },
    finished_at:
    {
        type: DataTypes.DATE,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    quiz_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: { model: 'quizzes', key: 'id' }
    },
}, { tableName: 'attempts', createdAt: 'created_at', updatedAt: false });

export default QuizAttempt;