import { authenticateUser } from "../middleware/authMiddleware";
import { updateCenterPoint } from "../controller/centerPoint";
import { Router } from "express";

const putRouter = Router();

putRouter.put("/updatecenterpoint", authenticateUser, updateCenterPoint);

export default putRouter;
