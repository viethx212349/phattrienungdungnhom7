export enum InternStatus { INTERNING = "ĐANG THỰC TẬP", PASSED = "ĐÃ PASS" }
export interface Intern {
  id: string;
  fullName: string;
  code: string;
  position: string;
  email: string;
  phone: string;
  status: InternStatus;
}