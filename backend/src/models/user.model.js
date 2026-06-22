import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id:
        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    auth_id:
    {
        type: DataTypes.STRING(255), allowNull: false, unique: {
            name: 'unique_auth_id_idx'
        }
    },
    email:
    {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: { msg: "No valid format." },
            notEmpty: { msg: "Email is required." }
        },
        unique: {
            name: 'unique_email_idx'
        }
    },
    name:
    {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
        validate: {
            len: {
                args: [0, 100],
                msg: "The name should be between 0 and 100 characters."
            }
        }
    },
    last_name:
    {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: '',
        validate: {
            len: {
                args: [0, 100],
                msg: "The last_name should be between 0 and 100 characters."
            }
        }
    },
    role:
    {
        type: DataTypes.ENUM('USER', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER'
    }
},
    {
        tableName: 'users',
        timestamps: true, 
        createdAt: 'created_at',
        updatedAt: false
    });

export { sequelize, User };