import {
  useKanban,
  columns,
  displayStatusLabels,
  displayStatusStyles,
  getColumnTasks,
  formatDueDate,
} from "../hooks/useKanban";
import { CalendarDays } from "lucide-react";
import Modal from "../../../components/Modal";
import EditTaskModal from "./EditTaskModal";
import type { Task, RawTaskStatus } from "../../../types/task";
import { useState, type DragEvent } from "react";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: RawTaskStatus) => void;
  onUpdateTask?: (
    taskId: string,
    updates: {
      title?: string;
      description?: string;
      assigneeId?: string;
      assigneeName?: string;
      dueDate?: string;
      attachments?: string[];
    },
  ) => void;
  onDeleteTask?: (taskId: string) => void;
}

const KanbanBoard = ({ tasks, onStatusChange, onUpdateTask, onDeleteTask }: KanbanBoardProps) => {
  const {
    selectedTask,
    setSelectedTask,
    dragOverColumn,
    setDragOverColumn,
    handleDragStart: internalHandleDragStart,
  } = useKanban(onStatusChange);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const canDropToColumn = (targetStatus: RawTaskStatus) => {
    if (targetStatus === "TODO" && draggedTaskId) {
      const draggedTask = tasks.find((task) => task.id === draggedTaskId);
      return draggedTask?.rawStatus === "TODO";
    }
    return true;
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    internalHandleDragStart(event, taskId);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: RawTaskStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const draggedTask = tasks.find((task) => task.id === taskId);

    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (!taskId || !draggedTask) {
      return;
    }

    if (status === "TODO" && draggedTask.rawStatus !== "TODO") {
      return;
    }

    onStatusChange(taskId, status);
  };

  const handleSave = (updates: {
    title?: string;
    description?: string;
    assigneeId?: string;
    assigneeName?: string;
    dueDate?: string;
    attachments?: string[];
  }) => {
    if (selectedTask && onUpdateTask) {
      onUpdateTask(selectedTask.id, updates);
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (selectedTask && onDeleteTask) {
      onDeleteTask(selectedTask.id);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
              Tiến độ công việc
            </p>
            <h1 className="mt-2 text-4xl font-black">Kanban Board Mentor</h1>
            <p className="mt-2 text-sm text-gray-600">
              Kéo thả task giữa các cột để thay đổi trạng thái.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-100 px-5 py-4 text-sm text-slate-700">
            Kéo thả để cập nhật trạng thái nhanh.
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {columns.map((column) => (
          <div
            key={column.rawStatus}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.rawStatus)}
            onDragEnter={() => {
              if (canDropToColumn(column.rawStatus)) {
                setDragOverColumn(column.rawStatus);
              }
            }}
            onDragLeave={() => setDragOverColumn(null)}
            className={`rounded-3xl border bg-white p-6 shadow-sm transition-all duration-200 ${
              dragOverColumn === column.rawStatus
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gray-500">
                  {column.title}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {getColumnTasks(column.rawStatus, tasks).length}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {getColumnTasks(column.rawStatus, tasks).map((task) => (
                <button
                  key={task.id}
                  type="button"
                  draggable
                  onDragStart={(event) => handleDragStart(event, task.id)}
                  onDragEnd={() => {
                    setDraggedTaskId(null);
                    setDragOverColumn(null);
                  }}
                  onClick={() => setSelectedTask(task)}
                  className="w-full rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-black hover:bg-gray-50"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <p className="text-base font-bold text-gray-900">
                      {task.title}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${displayStatusStyles[task.displayStatus]}`}
                    >
                      {displayStatusLabels[task.displayStatus]}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900">
                        Người nhận:{" "}
                      </span>
                      {task.assigneeName || "Chưa gán"}
                    </div>

                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarDays size={16} />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    )}

                    {task.rejectedCount && task.rejectedCount > 0 && (
                      <div className="text-orange-600">
                        Đã bị trả lại {task.rejectedCount} lần
                      </div>
                    )}
                  </div>
                </button>
              ))}

              {getColumnTasks(column.rawStatus, tasks).length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Không có task
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={Boolean(selectedTask)} onClose={handleCloseModal}>
        {selectedTask && (
          <EditTaskModal
            task={selectedTask}
            onCancel={handleCloseModal}
            onDelete={handleDelete}
            onSave={handleSave}
          />
        )}
      </Modal>
    </div>
  );
};

export default KanbanBoard;
