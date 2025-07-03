import { Request, Response } from "express";
import { AppDataSource } from "../data-resource";
import { BatasZNT } from "@/entity/batasZNT";

export const getBatasZNTbyKecKelTahun = async (req: Request, res: Response) => {
  try {
    const kdkec = String(req.query.kdkec);
    const kdkel = String(req.query.kdkel);
    const tahun = String(req.query.tahun);

    const batasZntRepo = AppDataSource.getRepository(BatasZNT);
    const dataBatasZnt = await batasZntRepo.find({
      where: {
        KD_KEC: kdkec,
        KD_KEL: kdkel,
        TAHUN: tahun,
      },
    });

    if (!dataBatasZnt) {
      return res.status(404).json({ message: "Tahun tidak ditemukan di database" });
    }

    return res.status(200).json({
      code: 200,
      data: dataBatasZnt,
      message: "Data batas ZNT dari tahun berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data batas ZNT dari tahun:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
