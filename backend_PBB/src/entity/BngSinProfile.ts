import { Column, Entity, Index } from "typeorm";

@Index("bng_sin_profile_fk2", ["kdBlok", "kdDati2", "kdJnsOp", "kdKecamatan", "kdKelurahan", "kdPropinsi", "noBng", "noUrut"], {})
@Index("bng_sin_profile_pkey", ["kdBlok", "kdDati2", "kdJnsOp", "kdKecamatan", "kdKelurahan", "kdPropinsi", "mfcabComp", "mfkppComp", "mfnpwpComp", "noBng", "noUrut"], { unique: true })
@Index("bng_sin_profile_fk", ["mfcabComp", "mfkppComp", "mfnpwpComp"], {})
@Entity("bng_sin_profile")
export class BngSinProfile {
  @Column("character", { primary: true, name: "kd_propinsi", length: 2 })
  kdPropinsi!: string;

  @Column("character", { primary: true, name: "kd_dati2", length: 2 })
  kdDati2!: string;

  @Column("character", { primary: true, name: "kd_kecamatan", length: 3 })
  kdKecamatan!: string;

  @Column("character", { primary: true, name: "kd_kelurahan", length: 3 })
  kdKelurahan!: string;

  @Column("character", { primary: true, name: "kd_blok", length: 3 })
  kdBlok!: string;

  @Column("character", { primary: true, name: "no_urut", length: 4 })
  noUrut!: string;

  @Column("character", { primary: true, name: "kd_jns_op", length: 1 })
  kdJnsOp!: string;

  @Column("smallint", { primary: true, name: "no_bng" })
  noBng!: number;

  @Column("character", { primary: true, name: "mfnpwp_comp", length: 9 })
  mfnpwpComp!: string;

  @Column("character", { primary: true, name: "mfkpp_comp", length: 3 })
  mfkppComp!: string;

  @Column("character", { primary: true, name: "mfcab_comp", length: 3 })
  mfcabComp!: string;
}
