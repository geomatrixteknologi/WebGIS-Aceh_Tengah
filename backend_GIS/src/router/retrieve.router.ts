import { authenticateUser } from "../middleware/authMiddleware";
import { getBatasPersilbyNOP } from "../controller/batasPersil.controller";
import { getBatasZNTbyKecKelTahun } from "../controller/batasZNT.controller";
import { retrieveCenterPoint } from "../controller/centerPoint";
import { getRefWarnaKelurahan } from "../controller/refWarnaKelurahan.controller";
import { getRefWarnaStatusPembayaran } from "../controller/refWarnaStatusPembayaran.controller";
import { getRefWarnaStatusPendaftaran } from "../controller/refWarnaStatusPendaftaran.controller";
import { getRefWarnaZNT } from "../controller/refWarnaZNT.controller";
import { checkfotopersil, GetFotoPersil } from "../controller/retrieveImage";
import { getBatasPersil, getBatasKelurahan, getBatasZNT, getBatasBlok } from "../controller/retriveshp";
import { getSebaranZNT } from "../controller/SebaranZNT.controller";
import { Router } from "express";

const retrieveRouter = Router();

retrieveRouter.get("/bataskelurahan", authenticateUser, getBatasKelurahan);
retrieveRouter.get("/batasblok", authenticateUser, getBatasBlok);
retrieveRouter.get("/batasznt", authenticateUser, getBatasZNT);
retrieveRouter.get("/bataszntbykeckeltahun", authenticateUser, getBatasZNTbyKecKelTahun);
retrieveRouter.get("/bataspersil", authenticateUser, getBatasPersil);
retrieveRouter.get("/bataspersilbyNOP", authenticateUser, getBatasPersilbyNOP);
retrieveRouter.get("/sebaranznt", authenticateUser, getSebaranZNT);
retrieveRouter.get("/refwarnakelurahan", authenticateUser, getRefWarnaKelurahan);
retrieveRouter.get("/refwarnastatuspembayaran", authenticateUser, getRefWarnaStatusPembayaran);
retrieveRouter.get("/refwarnastatuspendaftaran", authenticateUser, getRefWarnaStatusPendaftaran);
retrieveRouter.get("/refwarnaznt", authenticateUser, getRefWarnaZNT);
retrieveRouter.get("/fotopersil/:nop", authenticateUser, GetFotoPersil);
retrieveRouter.get("/checkfotopersil/:filename", authenticateUser, checkfotopersil);
retrieveRouter.get("/centerpoint", authenticateUser, retrieveCenterPoint);

export default retrieveRouter;
