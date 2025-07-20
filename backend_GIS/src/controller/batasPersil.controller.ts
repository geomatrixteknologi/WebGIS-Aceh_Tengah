import { Request, Response } from "express";
import { AppDataSource } from "../data-resource";
import { BatasPersil } from "../entity/batasPersil";

export const getBatasPersilbyNOP = async (req: Request, res: Response) => {
  try {
    const nop = String(req.query.nop);

    const batasPersilRepo = AppDataSource.getRepository(BatasPersil);
    const dataBatasPersil = await batasPersilRepo.findOne({
      where: {
        KD_PROV: nop.substring(0, 2),
        KD_KAB: nop.substring(2, 4),
        KD_KEC: nop.substring(4, 7),
        KD_KEL: nop.substring(7, 10),
        KD_BLOK: nop.substring(10, 13),
        NO_URUT: nop.substring(13, 17),
        KD_JNS_OP: nop.substring(17, 18),
      },
    });

    if (!dataBatasPersil) {
      return res.status(404).json({ message: "NOP tidak ditemukan di database" });
    }

    return res.status(200).json({
      code: 200,
      data: dataBatasPersil,
      message: "Data batas persil dari NOP berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas persil dari NOP:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
