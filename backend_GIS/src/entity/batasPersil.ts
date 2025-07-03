import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("batas_persil")
export class BatasPersil {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  geom!: string | null;

  @Column({ name: "KD_PROV" })
  KD_PROV!: string;

  @Column({ name: "KD_KAB" })
  KD_KAB!: string;

  @Column({ name: "KD_KEC" })
  KD_KEC!: string;

  @Column({ name: "KD_KEL" })
  KD_KEL!: string;

  @Column({ name: "KD_BLOK" })
  KD_BLOK!: string;

  @Column({ name: "NO_URUT", type: "varchar", nullable: true })
  NO_URUT!: string | null;

  @Column({ name: "KD_JNS_OP", type: "varchar", nullable: true })
  KD_JNS_OP!: string | null;

  @Column({ name: "FOTO_PERSIL", type: "text", array: true, nullable: true })
  FOTO_PERSIL!: string[] | null;
}
