import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("ref_warna_status_pendaftaran")
export class RefWarnaStatusPendaftaran {
  @PrimaryColumn()
  id!: number;

  // Terdaftar(1)/Pendaftaran sedang Diproses(2)/Belum Terdaftar(0) untuk status pendaftaran, jenis status berbeda untuk tiap jenis tematik
  @Column({ name: "STATUS", type: "varchar" })
  STATUS!: string;

  @Column({ name: "WARNA", type: "varchar" })
  WARNA!: string;
}
