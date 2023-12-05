import login from "../controllers/login.js";
import express from "express"; 
const loginRouter = express.Router();

import { registerGoogle } from "../controllers/authenticationGoogle.js";

loginRouter.post("/login", login);
loginRouter.post("/registergoogle", registerGoogle);


export default loginRouter;