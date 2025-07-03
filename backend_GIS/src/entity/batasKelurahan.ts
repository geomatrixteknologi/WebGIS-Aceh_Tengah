import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class BatasKelurahan {
  @Column({
    type: "geometry",
    spatialFeatureType: "Polygon",
    srid: 4326,
    nullable: true,
  })
  geom!: string | null;

  @PrimaryColumn()
  KD_PROV!: string;

  @PrimaryColumn()
  KD_KAB!: string;

  @PrimaryColumn()
  KD_KEC!: string;

  @PrimaryColumn()
  KD_KEL!: string;

  @PrimaryColumn()
  NM_KEL!: string;
}
