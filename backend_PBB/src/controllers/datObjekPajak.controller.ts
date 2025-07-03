import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DatObjekPajak } from "../entity/DatObjekPajak";

export const getAllDatObjekPajak = async (req: Request, res: Response) => {
  try {
    const datObjekPajakRepository = AppDataSource.getRepository(DatObjekPajak);
    const datObjekPajaks = await datObjekPajakRepository.find();
    return res.status(200).json({
      data: datObjekPajaks,
    });
  } catch (error) {
    console.error("Error mengambil data kode kecamatan:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
