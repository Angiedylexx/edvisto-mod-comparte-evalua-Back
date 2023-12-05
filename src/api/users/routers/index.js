import express from "express"; 
const usersRouter = express.Router();

import registerMongoDB from "../controllers/post.js";
import allUsers from "../controllers/get.js";
import userDelete from "../controllers/delete.js";
import resetPassword from "../controllers/patch.js"; 
import { signOutUser } from "../controllers/authenticationGoogle.js";

usersRouter.post("/register", registerMongoDB);
usersRouter.post("/logout", signOutUser);

usersRouter.get("/users", allUsers); 

usersRouter.delete("/users/:id", userDelete);

usersRouter.patch("/resetPassword", resetPassword);

export default usersRouter;