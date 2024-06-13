import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const Transaksi = db.define(
    "transaksi",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {      
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },
        tagihan: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        durasi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        jarak: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
        
    }
);

export default Transaksi;

(async () => {
    await db.sync();
})();