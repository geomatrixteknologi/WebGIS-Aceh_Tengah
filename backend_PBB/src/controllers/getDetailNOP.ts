import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DatObjekPajak } from "../entity/DatObjekPajak";

export const getDetailObjekPajak = async (req: Request, res: Response) => {
  try {
    const nop = String(req.query.nop); // Ambil NOP dari query parameter

    if (!nop) {
      return res.status(400).json({
        code: 400,
        message: "NOP tidak diberikan",
      });
    }

    const detailObjekPajakRepo = AppDataSource.getRepository(DatObjekPajak);

    // Query mencari berdasarkan gabungan kolom yang membentuk NOP
    const dataDetailObjekPajak = await detailObjekPajakRepo.findOne({
      where: {
        kdPropinsi: nop.substring(0, 2),
        kdDati2: nop.substring(2, 4),
        kdKecamatan: nop.substring(4, 7),
        kdKelurahan: nop.substring(7, 10),
        kdBlok: nop.substring(10, 13),
        noUrut: nop.substring(13, 17),
        kdJnsOp: nop.substring(17, 18),
      },
      relations: ["datPetaBlok", "subjekPajak", "datOpBangunans", "datOpBumis", "datSubjekPajakNjoptkps", "skps", "sppts", "stps"],
    });

    if (!dataDetailObjekPajak) {
      return res.status(200).json({
        code: 200,
        message: "Data tidak ditemukan untuk NOP yang diberikan",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Sukses",
      data: dataDetailObjekPajak,
    });
  } catch (error) {
    console.error("Error mengambil data detail NOP:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
