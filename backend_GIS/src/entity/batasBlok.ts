import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("batas_blok")
export class BatasBlok {
  @Column({
    type: "geometry",
    spatialFeatureType: "MultiPolygon",
    srid: 4326,
    nullable: true,
  })
  geom!: string | null;

  @PrimaryColumn({ name: "KD_PROV" })
  KD_PROV!: string;

  @PrimaryColumn({ name: "KD_KAB" })
  KD_KAB!: string;

  @PrimaryColumn({ name: "KD_KEC" })
  KD_KEC!: string;

  @PrimaryColumn({ name: "KD_KEL" })
  KD_KEL!: string;

  @PrimaryColumn({ name: "KD_BLOK" })
  KD_BLOK!: string;
}
