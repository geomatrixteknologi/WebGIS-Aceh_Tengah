import { authenticateUser } from "../middleware/authMiddleware";
import { getMe, getRole, login, logout, register, updateUser } from "../controller/auth";
import { validateLogin, validateRegister, validateUpdateUser } from "../middleware/validators";
import { Router } from "express";

const authRouther = Router();

authRouther.post("/register", authenticateUser, validateRegister, register);
authRouther.post("/login", validateLogin, login);
authRouther.post("/logout", authenticateUser, logout);
authRouther.put("/update", authenticateUser, validateUpdateUser, updateUser);
authRouther.get("/me", authenticateUser, getMe);
authRouther.get("/role", authenticateUser, getRole);

export default authRouther;
