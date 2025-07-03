export interface ApiResponse<T> {
  code: number;
  data: T[];
}

export interface GeomData {
  type: string;
  coordinates: [][];
}

// Backend PBB 
export interface SpptData {
  kdPropinsi: string;
  kdDati2: string;
  kdKecamatan: string;
  kdKelurahan: string;
  kdBlok: string;
  noUrut: string;
  kdJnsOp: string;
  statusPembayaranSppt: string;
}

export interface DatOpBumiData {
  kdPropinsi: string;
  kdDati2: string;
  kdKecamatan: string;
  kdKelurahan: string;
  kdBlok: string;
  noUrut: string;
  kdJnsOp: string;
  noBumi: number;
  kdZnt: string;
  luasBumi: string;
  jnsBumi: string;
  nilaiSistemBumi: string;
}

export interface Kecamatan {
  kdKecamatan: string;
  nmKecamatan: string;
}

export interface Kelurahan {
  kdKecamatan: string;
  kdKelurahan: string;
  nmKelurahan: string;
}

export interface LandData {
  kdPropinsi: string;
  kdDati2: string;
  kdKecamatan: string;
  kdKelurahan: string;
  kdBlok: string;
  noUrut: string;
  kdJnsOp: string;
  subjekPajakId: string;
  noFormulirSpop: string;
  noPersil: string | null;
  jalanOp: string;
  blokKavNoOp: string | null;
  rwOp: string | null;
  rtOp: string | null;
  kdStatusCabang: number;
  kdStatusWp: string;
  totalLuasBumi: string;
  totalLuasBng: string;
  njopBumi: string;
  njopBng: string;
  statusPetaOp: number;
  jnsTransaksiOp: string;
  tglPendataanOp: Date;
  nipPendata: string;
  tglPemeriksaanOp: Date;
  nipPemeriksaOp: string;
  tglPerekamanOp: Date;
  nipPerekamOp: string;
}

// Backend GIS
export interface WarnaData {
  id: number;
  STATUS: string;
  WARNA: string;
}

export interface WarnaKelData {
  id: number;
  WARNA: string;
  KD_PROV: string;
  KD_KAB: string;
  KD_KEC: string;
  KD_KEL: string;
  NM_KEL: string;
}

export interface WarnaZNTData {
  id: number;
  STATUS: string;
  WARNA: string;
  NIR_EKS?: number;
  NIR_ANAL?: number;
}

export interface ZNTData {
  KD_PROV: string;
  KD_KAB: string;
  KD_KEC: string;
  KD_KEL: string;
  KD_ZNT: string;
  TAHUN: string;
  NIR_EKS: number;
  NIR_ANAL: number;
  KLS_EKS: number;
  KLS_ANAL: number;
  LABEL_EKS: string;
  LABEL_ANAL: string;
}

export interface SebaranZNTData {
  kdPropinsi: string;
  kdDati2: string;
  kdKecamatan: string;
  kdKelurahan: string;
  kdBlok: string;
  noUrut: string;
  kdJnsOp: string;
  rwOp: string;
  rtOp: string;
  totalLuasBumi: string;
  totalLuasBng: string;
  njopBumi: string;
  njopBng: string;
  kdZnt: string;
  nir: string;
  wajibPajak: string;
}

interface PersilProp {
  KD_PROV: string;
  KD_KAB: string;
  KD_KEC: string;
  KD_KEL: string;
  KD_BLOK: string;
  NO_URUT: string;
  KD_JNS_OP: string;
  FOTO_PERSIL: string;
}

export interface PersilData {
  properties: PersilProp;
  geometry: GeomData;
}

export interface logged {
  code: number;
  loggedIn: boolean;
  data: {
    id: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
  };
  message: string;
}

export interface RoleDataAPI {
  code: number;
  data: { id: number; Role: string }[];
  message: string;
}

export interface RoleData {
  id: number;
  Role: string;
}

export interface register {
  message: string;
}
