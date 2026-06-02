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
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-4">
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
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 ${
              dragOverColumn === column.rawStatus
                ? "border-blue-400 bg-blue-50"
                : "border-slate-200"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  {column.title}
                </span>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs font-bold text-gray-600">
                  {getColumnTasks(column.rawStatus, tasks).length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
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
                  className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-400 hover:shadow-md"
                >
                  <p className="mb-3 text-sm font-semibold text-gray-900 leading-snug">
                    {task.title}
                  </p>

                  <div className="space-y-2">
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDays size={13} />
                        <span>{formatDueDate(task.dueDate)}</span>
                      </div>
                    )}

                    {task.assigneeName && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                          {task.assigneeName
                            .split(" ")
                            .map((w) => w[0])
                            .slice(-2)
                            .join("")}
                        </div>
                        <span className="text-xs text-gray-600">{task.assigneeName}</span>
                      </div>
                    )}

                    {!task.assigneeName && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
                          ?
                        </div>
                        <span className="text-xs text-gray-400">Chưa gán</span>
                      </div>
                    )}

                    {task.rejectedCount && task.rejectedCount > 0 && (
                      <div className="text-xs text-orange-600 font-medium">
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
