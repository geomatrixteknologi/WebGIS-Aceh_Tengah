import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("center_Point")
export class centerPoint {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "LATITUDE", type: "varchar" })
  LATITUDE!: string;

  @Column({ name: "LONGITUDE", type: "varchar" })
  LONGITUDE!: string;
}
