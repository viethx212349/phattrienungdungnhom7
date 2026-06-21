import { useState } from "react";
import type { RawTaskStatus, Task, DisplayTaskStatus } from "../../../types/task";

export const columns: { rawStatus: RawTaskStatus; title: string }[] = [
  { rawStatus: "TODO", title: "TODO" },
  { rawStatus: "IN_PROGRESS", title: "IN_PROGRESS" },
  { rawStatus: "IN_REVIEW", title: "IN_REVIEW" },
  { rawStatus: "DONE", title: "DONE" },
];

export const displayStatusLabels: Record<DisplayTaskStatus, string> = {
  UNASSIGNED: "Chưa gán",
  IN_PROGRESS: "Đang làm",
  NEEDS_REVISION: "Cần sửa",
  WAITING_REVIEW: "Chờ duyệt",
  COMPLETED: "Hoàn thành",
  OVERDUE: "Trễ hạn",
};

export const displayStatusStyles: Record<DisplayTaskStatus, string> = {
  UNASSIGNED: "bg-gray-100 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  NEEDS_REVISION: "bg-orange-100 text-orange-800",
  WAITING_REVIEW: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export const getColumnTasks = (status: RawTaskStatus, tasks: Task[]) => {
  let filtered = tasks.filter((task) => task.rawStatus === status);

  if (status === "TODO") {
    filtered = filtered.filter((task) => !task.assigneeId && !task.dueDate);
    // TODO: Sắp xếp theo ngày tạo (mới nhất lên đầu)
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else if (status === "IN_PROGRESS") {
    // IN_PROGRESS: Sắp xếp theo deadline (gần nhất lên đầu)
    filtered.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  } else if (status === "IN_REVIEW") {
    // IN_REVIEW: Sắp xếp theo ngày nộp (mới nộp lên đầu)
    filtered.sort((a, b) => new Date(b.submittedAt || b.createdAt || 0).getTime() - new Date(a.submittedAt || a.createdAt || 0).getTime());
  } else if (status === "DONE") {
    // DONE: Sắp xếp theo ngày hoàn thành (mới xong lên đầu)
    filtered.sort((a, b) => new Date(b.closedAt || b.createdAt || 0).getTime() - new Date(a.closedAt || a.createdAt || 0).getTime());
  }

  return filtered;
};

export const getActionLabel = (task: Task) => {
  if (task.rawStatus === "TODO") {
    return task.assigneeId ? "Xem chi tiết" : "Gán Intern";
  }

  if (task.rawStatus === "IN_REVIEW") {
    return "Xem review";
  }

  if (task.rawStatus === "DONE") {
    return "Xem kết quả";
  }

  return "Xem chi tiết";
};

export const formatDueDate = (dueDate?: string) => {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const useKanban = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return {
    selectedTask,
    setSelectedTask,
  };
};
