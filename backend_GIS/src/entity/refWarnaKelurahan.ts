import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ref_warna_kelurahan")
export class RefWarnaKelurahan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "WARNA", type: "varchar" })
  WARNA!: string;

  @Column({ name: "KD_PROV", type: "varchar", nullable: true })
  KD_PROV!: string | null;

  @Column({ name: "KD_KAB", type: "varchar", nullable: true })
  KD_KAB!: string | null;

  @Column({ name: "KD_KEC", type: "varchar", nullable: true })
  KD_KEC!: string | null;

  @Column({ name: "KD_KEL", type: "varchar", nullable: true })
  KD_KEL!: string | null;

  @Column({ name: "NM_KEL", type: "varchar", nullable: true })
  NM_KEL!: string | null;
}
