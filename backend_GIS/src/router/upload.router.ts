import { PostFotoPersil, uploadFotoMiddleware } from "../controller/uploadImage";
import { PostShpBlok, PostShpKelurahan, PostShpPersil, PostShpZNT } from "../controller/uploadshp";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import { Router } from "express";

const uploadRouter = Router();

uploadRouter.post("/bataskelurahan", uploadMiddleware, PostShpKelurahan); //post
uploadRouter.post("/batasblok", uploadMiddleware, PostShpBlok);
uploadRouter.post("/batasZNT", uploadMiddleware, PostShpZNT);
uploadRouter.post("/bataspersil", uploadMiddleware, PostShpPersil);
uploadRouter.post("/fotopersil/:nop", uploadFotoMiddleware, PostFotoPersil);

export default uploadRouter;
