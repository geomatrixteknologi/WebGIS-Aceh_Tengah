import { Column, Entity, Index } from "typeorm";

@Index("temp_sppt_pkey", ["kdBlok", "kdDati2", "kdJnsOp", "kdKecamatan", "kdKelurahan", "kdPropinsi", "noUrut", "thnTempSppt"], { unique: true })
@Index("t5_fk", ["kdBlok", "kdDati2", "kdJnsOp", "kdKecamatan", "kdKelurahan", "kdPropinsi", "noUrut"], {})
@Entity("temp_sppt")
export class TempSppt {
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

  @Column("character", { primary: true, name: "thn_temp_sppt", length: 4 })
  thnTempSppt!: string;

  @Column("character", { name: "status_sppt", length: 1, default: () => "'0'" })
  statusSppt!: string;
}
