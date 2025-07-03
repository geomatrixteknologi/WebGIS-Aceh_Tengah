import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DatOpBumi } from "../entity/DatOpBumi";

export const getDatOpBumi = async (req: Request, res: Response) => {
  try {
    const datOpBumiRepo = AppDataSource.getRepository(DatOpBumi);
    const dataDatOpBumi = await datOpBumiRepo.find({});

    return res.status(200).json({
      code: 200,
      data: dataDatOpBumi,
      message: "Data DatOpBumi berhasil diambil",
    });
  } catch (error) {
    console.error("Error mengambil data DatOpBumi:", error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};