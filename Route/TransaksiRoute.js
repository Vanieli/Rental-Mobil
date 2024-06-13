import express from "express";
import { getTrans, getTransById, createTrans, updateTrans, deleteTrans } from "../Controller/TransaksiController.js";
import { allowedRole, verifyUser } from "../midleware/Authentikasi.js";

const route = express.Router();

route.get("/transaksi", verifyUser, allowedRole("admin", "customer", "driver"), getTrans, );
route.get("/transaksi/:id", verifyUser, allowedRole("admin", "customer", "driver"), getTransById, );
route.post("/transaksi", verifyUser, allowedRole("customer"), createTrans, );
route.patch("/transaksi/:id", verifyUser, allowedRole("admin", "customer"), updateTrans, );
route.delete("/transaksi/:id", verifyUser, allowedRole("customer"), deleteTrans, );

export default route;