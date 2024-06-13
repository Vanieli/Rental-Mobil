import express from "express";
import { createMobil, getMobil, getMobilById, updateMobil, deleteMobil } from "../Controller/MobilController.js";
import { allowedRole, verifyUser } from "../midleware/Authentikasi.js";

const route = express.Router();

route.get("/mobil", verifyUser, allowedRole("admin", "customer", "driver"), getMobil);
route.get("/mobil/:id", verifyUser, allowedRole("admin", "customer", "driver"), getMobilById);
route.post("/mobil", verifyUser, allowedRole("admin"), createMobil);
route.patch("/mobil/:id", verifyUser, allowedRole("admin"), updateMobil);
route.delete("/mobil/:id", verifyUser, allowedRole("admin"), deleteMobil);

export default route;