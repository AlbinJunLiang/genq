import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Quiz = sequelize.define('Quiz', {
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
    title:
    {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [0, 255],
                msg: "The title should be between 0 and 255 characters."
            }
        }
    },
    description:
    {
        type: DataTypes.TEXT,
        defaultValue: '',
        validate: {
            len: {
                args: [0, 600],
                msg: "The description should be between 0 and 600 characters."
            }
        }
    },
    visibility:
    {
        type: DataTypes.ENUM('PUBLIC', 'PRIVATE', 'ACCESS_ONLY_VIA_LINK', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'PUBLIC'
    },
    end_at:
    {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration_seconds:
    {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    attempts_limit:
    {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    user_id: {
        type: DataTypes.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' }
    },
}, { tableName: 'quizzes', createdAt: 'created_at', updatedAt: false });

export { sequelize, Quiz };