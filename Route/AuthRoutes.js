import express from 'express';
import { checkLog, login, logout, refreshToken } from '../Controller/AuthController.js';

const route = express.Router();

route.post("/login", login);
route.get("/me", checkLog);
route.delete("/logout", logout);
route.get("/token", refreshToken);

export default route;
