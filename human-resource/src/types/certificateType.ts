export type Certificate = {
  id: string
  certificate: File | null | string;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
  qualification: string; // KUALIFIKASI
  subQualification: string; // SUBKUALIFIKASI
  certificateNo: string; // NO. SERTIFIKAT
  registrationNo?: string; // NO. REGISTRASI
  level?: number; // LEVEL
  issueDate: string; // MASA AKTIF TERBIT
  expireDate: string; // MASA AKTIF EXPIRED
  status: string; // TERPAKAI/BELUM
  company?: string; // PERUSAHAAN
  documentLink?: string; // LINK DOCUMENT
  account?: string; // Akun
  password?: string; // Password
  sbu?: string; // SBU (mungkin maksudmu field ini belum lengkap)
  employee: {
    fullName: string;
  };
};
