import { updateCenterPoint } from "../controller/centerPoint";
import { Router } from "express";

const putRouter = Router();

putRouter.put("/updatecenterpoint", updateCenterPoint);

export default putRouter;
