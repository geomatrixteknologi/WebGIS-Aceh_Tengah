import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DatObjekPajak } from "../entity/DatObjekPajak";

export const getNamaWajibPajak = async (req: Request, res: Response) => {
  try {
    const { namawp = "", page = "1", limit = "10" } = req.query;

    const currentPage = parseInt(page as string, 10) || 1;
    const perPage = parseInt(limit as string, 10) || 10;
    const skip = (currentPage - 1) * perPage;

    const objekRepo = AppDataSource.getRepository(DatObjekPajak);

    // === Step 1: Hitung total data berdasarkan jumlah NOP ===
    const countResult = await objekRepo
      .createQueryBuilder("op")
      .innerJoin("op.subjekPajak", "sp")
      .where("sp.nmWp ILIKE :namawp", { namawp: `%${namawp}%` })
      .select("COUNT(*)", "count")
      .getRawOne();

    const totalData = parseInt(countResult.count, 10);
    const totalPage = Math.ceil(totalData / perPage);

    // === Step 2: Ambil data per-NOP + data wajib pajak ===
    const data = await objekRepo
      .createQueryBuilder("op")
      .innerJoin("op.subjekPajak", "sp")
      .where("sp.nmWp ILIKE :namawp", { namawp: `%${namawp}%` })
      .select([`CONCAT(op.kdPropinsi, op.kdDati2, op.kdKecamatan, op.kdKelurahan, op.kdBlok, op.noUrut, op.kdJnsOp) AS nop`, "sp.nmWp AS namawp", "sp.subjekPajakId AS subjekPajakId", "sp.jalanWp AS alamat"])
      .offset(skip)
      .limit(perPage)
      .getRawMany();

    // === Step 3: Format response ===
    const formatted = data.map((item: any) => ({
      nop: item.nop,
      nmWp: item.namawp,
      subjekPajakId: item.subjekPajakId?.trim() || null,
      alamat: item.alamat,
    }));

    return res.status(200).json({
      code: 200,
      message: "Berhasil mendapatkan data wajib pajak",
      data: formatted,
      pagination: {
        page: currentPage,
        limit: perPage,
        totalData,
        totalPage,
      },
    });
  } catch (error) {
    console.error("Error mengambil data nama wajib pajak (queryBuilder):", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};
