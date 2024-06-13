import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Mobil = db.define(
    "mobil",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        jenis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nomor: {      
            type: DataTypes.STRING,
            allowNull: false,
        },
        warna: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bangku: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
        
    }
);

export default Mobil;
(async () => {
    await db.sync();
})();