import { Router } from "express";
import retrieveRouter from "./getRouter";

const apiRouter = Router();

apiRouter.use("/retrieve", retrieveRouter);

export default apiRouter;
