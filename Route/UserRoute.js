import express from "express";
import { createUser, getUser, updateUser, deleteUser, getUserById } from "../Controller/UserController.js";
import { allowedRole, verifyUser } from "../midleware/Authentikasi.js";

const route = express.Router();

route.get("/user", verifyUser, allowedRole("admin", "driver"), getUser);
route.get("/user/:id", verifyUser, allowedRole("admin", "driver"), getUserById);
route.post("/user", verifyUser, allowedRole("admin"), createUser);
route.patch("/user/:id", verifyUser, allowedRole("admin"), updateUser);
route.delete("/user/:id", verifyUser, allowedRole("admin"), deleteUser);

export default route;