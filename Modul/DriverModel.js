import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Mobil from "./MobilModel.js";

const Driver = db.define(
    "driver",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_uuid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobil_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status_kerja: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
        
    }
);

export default Driver;

(async () => {
    await db.sync();
})();