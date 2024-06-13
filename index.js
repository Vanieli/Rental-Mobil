import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import session from "express-session";
import db from "./config/Database.js";
import sequelizeStore from "connect-session-sequelize";

// Model
import User from "./Modul/UserModel.js";
import Mobil from "./Modul/MobilModel.js";
import Transaksi from "./Modul/TransaksiModel.js";
import Driver from "./Modul/DriverModel.js";

// Route
import UserRoute from "./Route/UserRoute.js";
import MobilRoute from "./Route/MobilRoute.js";
import TransaksiRoute from "./Route/TransaksiRoute.js";
import DriverRoute from "./Route/DriverRoute.js";
import AuthRoute from "./Route/AuthRoutes.js";
import { checkLog, logout } from "./Controller/AuthController.js";

dotenv.config();
const app = express();
const sessionStore = sequelizeStore(session.Store);
const store = new sessionStore({ db: db });

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto",
    }
}));

app.use(cookieParser());
app.use(express.json());        // Translator JSON ==> API
app.use(fileUpload());          // Translator HTML format ==> API
app.use(express.static("public"));

// ROUTE        ROUTE       ROUTE
// ROUTE        ROUTE       ROUTE
// ROUTE        ROUTE       ROUTE
app.use(UserRoute, MobilRoute, TransaksiRoute, DriverRoute, AuthRoute);
// --------------------------------------------------------------------------------------------------------------------------------------------------------
// HANDLER:     url not have already
// HANDLER:     url not have already
// HANDLER:     url not have already
app.use((req, res, next) => {
    res.status(404).json({ msg: "Halaman tidak ditemukan" });
});
// --------------------------------------------------------------------------------------------------------------------------------------------------------
// SERVER       SERVER          SERVER
// SERVER       SERVER          SERVER
// SERVER       SERVER          SERVER
app.listen(process.env.APP_PORT, () => {
    console.log("\n\t--- SERVER ---\f\t~ PORT:", process.env.APP_PORT, "\n");
});



