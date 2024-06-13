import { Sequelize } from "sequelize";

const db = new Sequelize("rentalmobil", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

export default db;