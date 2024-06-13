import express from "express";
import { createDriver, deleteDriver, getDriver, getDriverById, updateDriver } from "../Controller/DriverController.js";
import { allowedRole, verifyUser } from "../midleware/Authentikasi.js";

const route = express.Router();

route.get("/driver", verifyUser, allowedRole("admin", "customer"), getDriver, );
route.get("/driver/:id", verifyUser, allowedRole("admin", "customer"), getDriverById, );
route.post("/driver", verifyUser, allowedRole("admin"), createDriver, );
route.patch("/driver/:id", verifyUser, allowedRole("admin"), updateDriver, );
route.delete("/driver/:id", verifyUser, allowedRole("admin"), deleteDriver, );

export default route;