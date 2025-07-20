import { Column, Entity, Index } from "typeorm";

@Index("dat_login_pkey", ["nmLogin"], { unique: true })
@Entity("dat_login")
export class DatLogin {
  @Column("character varying", { primary: true, name: "nm_login", length: 18 })
  nmLogin!: string;

  @Column("character", { name: "nip", length: 18 })
  nip!: string;

  @Column("character varying", { name: "password", length: 50 })
  password!: string;
}
