import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DatObjekPajak } from "../entity/DatObjekPajak";
import { DatNir } from "../entity/DatNir";

export const getSebaranZntDatObjekPajak = async (req: Request, res: Response) => {
  try {
    const tahun = Number(req.query.tahun);
    const { kdkec, kdkel } = req.query;
    const datObjekPajakRepository = AppDataSource.getRepository(DatObjekPajak);
    const datObjekPajaks = await datObjekPajakRepository
      .createQueryBuilder("dop") // Alias untuk DatObjekPajak
      .innerJoin("dop.datOpBumis", "dob") // JOIN ke DatOpBumi
      .innerJoin(
        DatNir,
        "dn",
        `
        dop.kd_kecamatan = dn.kd_kecamatan
        AND dop.kd_kelurahan = dn.kd_kelurahan
        AND dob.kd_znt = dn.kd_znt
        AND dn.thn_nir_znt = :tahun
      `,
        { tahun }
      ) // JOIN ke DatNir berdasarkan kd_znt dari DatOpBumi
      .where("dop.kd_kecamatan = :kdkec", { kdkec })
      .andWhere("dop.kd_kelurahan = :kdkel", { kdkel })
      .select([
        "dop.kd_propinsi AS kdPropinsi",
        "dop.kd_dati2 AS kdDati2",
        "dop.kd_kecamatan AS kdKecamatan",
        "dop.kd_kelurahan AS kdKelurahan",
        "dop.kd_blok AS kdBlok",
        "dop.no_urut AS noUrut",
        "dop.kd_jns_op AS kdJnsOp",
        "dop.rw_op AS rwOp",
        "dop.rt_op AS rtOp",
        "dop.total_luas_bumi AS totalLuasBumi",
        "dop.total_luas_bng AS totalLuasBng",
        "dop.njop_bumi AS njopBumi",
        "dop.njop_bng AS njopBng",
        "dob.kd_znt AS kdZnt",
        "dn.nir AS nir",
        "dop.subjek_pajak_id AS wajibPajak",
      ])
      .getRawMany();
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
