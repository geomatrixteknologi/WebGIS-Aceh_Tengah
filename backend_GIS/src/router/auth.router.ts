import { getMe, getRole, login, logout, register, updateUser } from "../controller/auth";
import { validateLogin, validateRegister, validateUpdateUser } from "../middleware/validators";
import { Router } from "express";

const authRouther = Router();

authRouther.post("/register", validateRegister, register);
authRouther.post("/login", validateLogin, login);
authRouther.post("/logout", logout);
authRouther.put("/update", validateUpdateUser, updateUser);
authRouther.get("/me", getMe);
authRouther.get("/role", getRole);

export default authRouther;
