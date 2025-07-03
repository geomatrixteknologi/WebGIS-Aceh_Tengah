import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ref_warna_znt")
export class RefWarnaZNT {
  @PrimaryGeneratedColumn()
  id!: number;

  // AA/AB/...dst
  @Column({ name: "STATUS", type: "varchar" })
  STATUS!: string;

  @Column({ name: "WARNA", type: "varchar" })
  WARNA!: string;
}
