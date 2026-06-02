import type { Intern } from "../types/intern";
import { InternStatus } from "../types/intern";

//Test Jestjs ở đây
export const mockInterns: Intern[] = [
  {
    id: "1",
    fullName: "Nguyễn Thành Long",
    code: "#TTS-2024-001",
    position: "Frontend Developer",
    email: "long.nt@architect.com",
    phone: "0901 234 567",
    status: InternStatus.INTERNING,
  },
  {
    id: "2",
    fullName: "Hoàng Minh Phương",
    code: "#TTS-2024-042",
    position: "UI/UX Designer",
    email: "phuong.hm@architect.com",
    phone: "0987 654 321",
    status: InternStatus.PASSED,
  },
  {
    id: "3",
    fullName: "Trần Gia Bảo",
    code: "#TTS-2024-033",
    position: "Backend Developer",
    email: "bao.tg@architect.com",
    phone: "0909 555 777",
    status: InternStatus.INTERNING,
  },
  {
    id: "4",
    fullName: "Lê Quốc Anh",
    code: "#TTS-2024-090",
    position: "QA Tester",
    email: "anh.lq@architect.com",
    phone: "0912 888 666",
    status: InternStatus.PASSED,
  },
  {
    id: "5",
    fullName: "Ngô Minh Tú",
    code: "#TTS-2024-102",
    position: "Mobile Developer",
    email: "tu.nm@architect.com",
    phone: "0977 111 333",
    status: InternStatus.INTERNING,
  },
  {
    id: "6",
    fullName: "Đặng Hải Nam",
    code: "#TTS-2024-120",
    position: "Data Analyst",
    email: "nam.dh@architect.com",
    phone: "0933 222 999",
    status: InternStatus.PASSED,
  },
];