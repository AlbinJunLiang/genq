import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Answer = sequelize.define('Answer', {
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
    is_correct:
    {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status:
    {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE'
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questions', key: 'id' }
    },
}, { tableName: 'answers', timestamps: false });

export default Answer;