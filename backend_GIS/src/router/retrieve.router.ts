import { getBatasPersilbyNOP } from "../controller/batasPersil.controller";
import { getBatasZNTbyKecKelTahun } from "../controller/batasZNT.controller";
import { getRefWarnaKelurahan } from "../controller/refWarnaKelurahan.controller";
import { getRefWarnaStatusPembayaran } from "../controller/refWarnaStatusPembayaran.controller";
import { getRefWarnaStatusPendaftaran } from "../controller/refWarnaStatusPendaftaran.controller";
import { getRefWarnaZNT } from "../controller/refWarnaZNT.controller";
import { checkfotopersil, GetFotoPersil } from "../controller/retrieveImage";
import { getBatasPersil, getBatasKelurahan, getBatasZNT, getBatasBlok } from "../controller/retriveshp";
import { getSebaranZNT } from "../controller/SebaranZNT.controller";
import { Router } from "express";

const retrieveRouter = Router();

retrieveRouter.get("/bataskelurahan", getBatasKelurahan);
retrieveRouter.get("/batasblok", getBatasBlok);
retrieveRouter.get("/batasznt", getBatasZNT);
retrieveRouter.get("/bataszntbykeckeltahun", getBatasZNTbyKecKelTahun);
retrieveRouter.get("/bataspersil", getBatasPersil);
retrieveRouter.get("/bataspersilbyNOP", getBatasPersilbyNOP);
retrieveRouter.get("/sebaranznt", getSebaranZNT);
retrieveRouter.get("/refwarnakelurahan", getRefWarnaKelurahan);
retrieveRouter.get("/refwarnastatuspembayaran", getRefWarnaStatusPembayaran);
retrieveRouter.get("/refwarnastatuspendaftaran", getRefWarnaStatusPendaftaran);
retrieveRouter.get("/refwarnaznt", getRefWarnaZNT);
retrieveRouter.get("/fotopersil/:nop", GetFotoPersil);
retrieveRouter.get("/checkfotopersil/:filename", checkfotopersil);

export default retrieveRouter;
