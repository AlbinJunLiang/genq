import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Model = sequelize.define('Model', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // sequelize, // ELIMINA ESTA LÍNEA, es innecesaria aquí
    modelName: "Model",
    tableName: "models",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["model", "provider"],
        },
    ],
});

export default Model;