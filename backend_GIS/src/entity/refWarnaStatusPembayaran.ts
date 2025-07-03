import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("ref_warna_status_pembayaran")
export class RefWarnaStatusPembayaran {
  @PrimaryColumn()
  id!: number;

  // Lunas/Tidak Lunas untuk status pembayaran, jenis status berbeda untuk tiap jenis tematik
  @Column({ name: "STATUS", type: "varchar" })
  STATUS!: string;

  @Column({ name: "WARNA", type: "varchar" })
  WARNA!: string;
}
