export interface TaskStat {
  label: string;
  value: string;
}

export interface WorkHistory {
  title: string;
  date: string;
  status: "HOÀN THÀNH" | "TRỄ HẠN";
}

export interface InternDetails {
  internId: string;
  taskStats: TaskStat[];
  workHistory: WorkHistory[];
}

// Mock data for intern details
export const internDetails: InternDetails[] = [
  {
    internId: "1",
    taskStats: [
      { label: "Tổng task", value: "12" },
      { label: "Hoàn thành", value: "10" },
      { label: "Trễ hạn", value: "2" },
    ],
    workHistory: [
      { title: "Thiết kế UI Dashboard", date: "24/10/2026", status: "HOÀN THÀNH" },
      { title: "Kiểm tra API Login", date: "20/10/2026", status: "TRỄ HẠN" },
      { title: "Nghiên cứu vật liệu mới", date: "18/10/2026", status: "HOÀN THÀNH" },
    ],
  },
  {
    internId: "2",
    taskStats: [
      { label: "Tổng task", value: "8" },
      { label: "Hoàn thành", value: "8" },
      { label: "Trễ hạn", value: "0" },
    ],
    workHistory: [
      { title: "Thiết kế Mockup Figma", date: "22/10/2026", status: "HOÀN THÀNH" },
      { title: "Xây dựng Design System", date: "19/10/2026", status: "HOÀN THÀNH" },
    ],
  },
  {
    internId: "3",
    taskStats: [
      { label: "Tổng task", value: "15" },
      { label: "Hoàn thành", value: "12" },
      { label: "Trễ hạn", value: "3" },
    ],
    workHistory: [
      { title: "Phát triển API REST", date: "23/10/2026", status: "HOÀN THÀNH" },
      { title: "Xử lý Database", date: "21/10/2026", status: "TRỄ HẠN" },
      { title: "Kiểm thử Unit Test", date: "19/10/2026", status: "HOÀN THÀNH" },
    ],
  },
  {
    internId: "4",
    taskStats: [
      { label: "Tổng task", value: "10" },
      { label: "Hoàn thành", value: "9" },
      { label: "Trễ hạn", value: "1" },
    ],
    workHistory: [
      { title: "Test Case & Bug Report", date: "25/10/2026", status: "HOÀN THÀNH" },
      { title: "Kiểm thử Regression", date: "23/10/2026", status: "TRỄ HẠN" },
    ],
  },
  {
    internId: "5",
    taskStats: [
      { label: "Tổng task", value: "11" },
      { label: "Hoàn thành", value: "10" },
      { label: "Trễ hạn", value: "1" },
    ],
    workHistory: [
      { title: "Phát triển App Mobile", date: "24/10/2026", status: "HOÀN THÀNH" },
      { title: "Tối ưu Performance", date: "20/10/2026", status: "HOÀN THÀNH" },
    ],
  },
  {
    internId: "6",
    taskStats: [
      { label: "Tổng task", value: "9" },
      { label: "Hoàn thành", value: "9" },
      { label: "Trễ hạn", value: "0" },
    ],
    workHistory: [
      { title: "Triển khai Server", date: "22/10/2026", status: "HOÀN THÀNH" },
      { title: "Quản lý CI/CD", date: "18/10/2026", status: "HOÀN THÀNH" },
    ],
  },
];

export const getInternDetails = (internId: string): InternDetails | undefined => {
  return internDetails.find((detail) => detail.internId === internId);
};
