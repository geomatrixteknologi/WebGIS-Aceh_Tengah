import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("batas_znt")
export class BatasZNT {
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

  @Column({ name: "KD_ZNT" })
  KD_ZNT!: string;

  @Column({ name: "TAHUN" })
  TAHUN!: string;

  @Column({ name: "NIR_EKS" })
  NIR_EKS!: number;

  @Column({ name: "NIR_ANAL" })
  NIR_ANAL!: number;

  @Column({ name: "KLS_EKS" })
  KLS_EKS!: number;

  @Column({ name: "KLS_ANAL" })
  KLS_ANAL!: number;

  @Column({ name: "LABEL_EKS" })
  LABEL_EKS!: string;

  @Column({ name: "LABEL_ANAL" })
  LABEL_ANAL!: string;
}
