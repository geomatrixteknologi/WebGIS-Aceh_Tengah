import { Router } from "express";
import { getKodeKecamatan, getKodeKelurahan } from "../controllers/getKodeWilayah.controller";
import { getAllDatObjekPajak } from "../controllers/datObjekPajak.controller";
import { getDetailObjekPajak } from "../controllers/getDetailNOP";
import { getSpptbyTahun } from "../controllers/sppt.controller";
import { getDatOpBumi } from "../controllers/datOpBumi.controller";
import { getSebaranZntDatObjekPajak } from "../controllers/sebaranZntDatObjekPajak.controller";

const retrieveRouter = Router();

retrieveRouter.get("/dataobjekpajak", getAllDatObjekPajak as any);
retrieveRouter.get("/sebaranzntdataobjekpajak", getSebaranZntDatObjekPajak as any);
retrieveRouter.get("/kodekecamatan", getKodeKecamatan as any);
retrieveRouter.get("/kodekelurahan", getKodeKelurahan as any);
retrieveRouter.get("/detailnop", getDetailObjekPajak as any);
retrieveRouter.get("/spptbytahun", getSpptbyTahun as any);
retrieveRouter.get("/datopbumi", getDatOpBumi as any);

export default retrieveRouter;
