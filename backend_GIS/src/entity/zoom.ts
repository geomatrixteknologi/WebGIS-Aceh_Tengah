import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("zoom")
export class zoom {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "zoom" })
  zoom!: number;
}
