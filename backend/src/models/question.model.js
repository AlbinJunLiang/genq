import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Question = sequelize.define('Question', {
    id:
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content:
    {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [0, 600],
                msg: "The content should be between 0 and 600 characters."
            }
        }
    },
    feedback:
    {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 600],
                msg: "The feedbak should be between 0 and 600 characters."
            }
        }
    },
    type:
    {
        type: DataTypes.ENUM('UNIQUE', 'MULTIPLE', 'OTHER'),
        allowNull: false
    },
    status:
    {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'quizzes', key: 'id' }
    },
}, { tableName: 'questions', timestamps: false });

export default Question;