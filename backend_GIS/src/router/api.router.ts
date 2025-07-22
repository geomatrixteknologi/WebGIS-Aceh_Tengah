import { Router } from "express";
import uploadRouter from "./upload.router";
import retrieveRouter from "./retrieve.router";
import authRouther from "./auth.router";
import putRouter from "./put.router";

const apiRouter = Router();

apiRouter.use("/upload", uploadRouter);
apiRouter.use("/retrieve", retrieveRouter);
apiRouter.use("/auth", authRouther);
apiRouter.use("/put", putRouter);

export default apiRouter;
