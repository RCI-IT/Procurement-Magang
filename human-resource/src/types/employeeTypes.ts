import { Certificate } from "crypto";

export type TypeKaryawan = {
  foto: string;
  nama: string;
  idKaryawan: string;
  posisi: string;
};

export type Document = {
  id: string;
  employeeId: string;
  idCard: File | null | string;
  taxCard: File | null | string;
  familyCard: File | null | string;
  diploma: File | null | string;
  createdAt: string;
  updatedAt: string;
};

export type Employee = {
  id: string;
  employeeNumber: string;
  idCardNumber: string;
  image: File | null;
  fullName: string;
  birth: string;
  birthDate: string;
  gender: string;
  religion: string;
  address: string;
  email: string;
  phone: string;
  education: string;
  school: string;
  major: string;
  position: string;
  salary: number;
  status: string;
  hireDate: string;
  leaveDate: string;
  resignDate: string;
  createdAt: string;
  updatedAt: string;
  document: Document;
  certificate?: Certificate;
};
