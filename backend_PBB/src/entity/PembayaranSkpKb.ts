import { Column, Entity, Index } from "typeorm";

@Index("pembayaran_skp_kb_pkey", ["kdBlok", "kdDati2", "kdJnsOp", "kdKecamatan", "kdKelurahan", "kdPropinsi", "noUrut", "pembayaranSkpKbKe", "thnPajakSkpKb"], { unique: true })
@Entity("pembayaran_skp_kb")
export class PembayaranSkpKb {
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

  @Column("character", { primary: true, name: "thn_pajak_skp_kb", length: 4 })
  thnPajakSkpKb!: string;

  @Column("smallint", { primary: true, name: "pembayaran_skp_kb_ke" })
  pembayaranSkpKbKe!: number;

  @Column("character", { name: "kd_kanwil", length: 2 })
  kdKanwil!: string;

  @Column("character", { name: "kd_kantor", length: 2 })
  kdKantor!: string;

  @Column("character", { name: "kd_tp", length: 2 })
  kdTp!: string;

  @Column("bigint", { name: "denda_skp_kb", default: () => "0" })
  dendaSkpKb!: string;

  @Column("bigint", { name: "jml_skp_kb_yg_dibayar" })
  jmlSkpKbYgDibayar!: string;

  @Column("timestamp without time zone", { name: "tgl_pembayaran_skp_kb" })
  tglPembayaranSkpKb!: Date;

  @Column("timestamp without time zone", {
    name: "tgl_rekam_byr_skp_kb",
    default: () => "statement_timestamp()",
  })
  tglRekamByrSkpKb!: Date;

  @Column("character", { name: "nip_perekam_byr_skp_kb", length: 18 })
  nipPerekamByrSkpKb!: string;
}
