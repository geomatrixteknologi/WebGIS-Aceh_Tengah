import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { BatasKelurahan } from "./entity/batasKelurahan";
import { BatasPersil } from "./entity/batasPersil";
import { RefWarnaStatusPembayaran } from "./entity/refWarnaStatusPembayaran";
import { RefWarnaStatusPendaftaran } from "./entity/refWarnaStatusPendaftaran";
import { userAccount } from "./entity/userAccount";
import { accountRole } from "./entity/accountRole";
import { RefWarnaZNT } from "./entity/refWarnaZNT";
import { BatasZNT } from "./entity/batasZNT";
import { BatasBlok } from "./entity/batasBlok";
import { RefWarnaKelurahan } from "./entity/refWarnaKelurahan";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST || "localhost",
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME || "postgres",
  password: DB_PASSWORD || "root",
  database: DB_DATABASE || "gismura",
  synchronize: true,
  logging: true,
  entities: [BatasZNT, BatasKelurahan, BatasBlok, BatasPersil, RefWarnaKelurahan, RefWarnaStatusPembayaran, RefWarnaStatusPendaftaran, RefWarnaZNT, userAccount, accountRole],
  subscribers: [],
  migrations: [],
});
