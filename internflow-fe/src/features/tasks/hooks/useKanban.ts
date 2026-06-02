import { useCallback, useState, type DragEvent } from "react";
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
  const filtered = tasks.filter((task) => task.rawStatus === status);

  if (status === "TODO") {
    return filtered.filter((task) => !task.assigneeId && !task.dueDate);
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

export const useKanban = (
  onStatusChange: (taskId: string, newStatus: RawTaskStatus) => void
) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<RawTaskStatus | null>(null);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLButtonElement>, taskId: string) => {
      event.dataTransfer.setData("text/plain", taskId);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>, status: RawTaskStatus) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData("text/plain");
      if (taskId) {
        onStatusChange(taskId, status);
      }
      setDragOverColumn(null);
    },
    [onStatusChange]
  );

  return {
    selectedTask,
    setSelectedTask,
    dragOverColumn,
    setDragOverColumn,
    handleDragStart,
    handleDrop,
  };
};
