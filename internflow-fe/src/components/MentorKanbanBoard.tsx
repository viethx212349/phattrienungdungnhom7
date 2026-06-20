import { useState } from 'react';
import { Task } from '../types';
import useTaskKanban from '../hooks/useTaskKanban';
import TaskDetailModal from './TaskDetailModal';
import MentorTaskReviewModal from './MentorTaskReviewModal';
import NewTaskModal from './NewTaskModal';

const statusLabelMap: Record<Task['display_status'], string> = {
  UNASSIGNED: 'Chưa gán',
  IN_PROGRESS: 'Đang làm',
  NEEDS_REVISION: 'Cần sửa',
  WAITING_REVIEW: 'Chờ duyệt',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Trễ hạn',
};

const statusBadgeStyle: Record<Task['display_status'], string> = {
  UNASSIGNED: 'bg-gray-100 text-slate-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  NEEDS_REVISION: 'bg-orange-100 text-orange-700',
  WAITING_REVIEW: 'bg-violet-100 text-violet-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-rose-100 text-rose-700',
};

const columns = [
  { title: 'TODO', status: 'TODO' as const },
  { title: 'IN_PROGRESS', status: 'IN_PROGRESS' as const },
  { title: 'IN_REVIEW', status: 'IN_REVIEW' as const },
  { title: 'DONE', status: 'DONE' as const }
];

export default function MentorKanbanBoard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalType, setModalType] = useState<'editor' | 'review' | 'readonly' | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const { data, isLoading, error, refresh } = useTaskKanban();

  const board = data ?? {
    TODO: [],
    IN_PROGRESS: [],
    IN_REVIEW: [],
    DONE: []
  };

  const openTask = (task: Task) => {
    if (task.status === 'IN_REVIEW') {
      setModalType('review');
    } else if (task.status === 'DONE') {
      setModalType('readonly');
    } else {
      setModalType('editor');
    }
    setSelectedTask(task);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setModalType(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">InternFlow Mentor</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tiến độ công việc</h1>
            <p className="mt-1 text-sm text-slate-600">Theo dõi trạng thái task theo Kanban board, không hỗ trợ kéo thả thủ công.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-6">
        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            Lỗi khi tải dữ liệu Kanban: {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-4">
          {columns.map((column) => {
            const tasks = board[column.status];
            return (
              <section key={column.status} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">{column.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">{tasks.length} task</p>
                </div>
                <div className="space-y-4 p-5">
                  {isLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 animate-pulse">
                          <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
                          <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-200"></div>
                          <div className="mt-2 h-3 w-1/3 rounded-full bg-slate-200"></div>
                        </div>
                      ))
                    : tasks.length > 0
                    ? tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                              onClick={() => openTask(task)}
                          className="w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-400 hover:bg-slate-100"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyle[task.display_status]}`}>
                              {statusLabelMap[task.display_status]}
                            </span>
                          </div>
                          <div className="mt-3 space-y-2 text-sm text-slate-600">
                            <p>
                              <span className="font-medium text-slate-800">Người thực hiện:</span>{' '}
                              {task.intern_name ?? task.intern?.full_name ?? 'Chưa gán'}
                            </p>
                            {task.due_date && (
                              <p>
                                <span className="font-medium text-slate-800">Deadline:</span> {new Date(task.due_date).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                            {task.rejected_count > 0 && (
                              <p className="text-rose-700">Đã bị trả lại {task.rejected_count} lần</p>
                            )}
                          </div>
                        </button>
                      ))
                    : (
                      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                        Không có task trong cột này.
                      </div>
                    )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <button
        type="button"
        onClick={() => setShowNewTask(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition hover:bg-slate-700"
        aria-label="Tạo task mới"
      >
        <span className="text-3xl font-bold leading-none">+</span>
      </button>

      {selectedTask && modalType === 'editor' && (
        <TaskDetailModal
          task={selectedTask}
          onClose={closeModal}
          onSaved={refresh}
          onDeleted={() => {
            refresh();
            closeModal();
          }}
        />
      )}
      {selectedTask && modalType === 'readonly' && (
        <TaskDetailModal task={selectedTask} onClose={closeModal} readOnly />
      )}
      {selectedTask && modalType === 'review' && (
        <MentorTaskReviewModal task={selectedTask} onClose={closeModal} onSaved={refresh} />
      )}
      {showNewTask && (
        <NewTaskModal
          isOpen={showNewTask}
          onClose={() => setShowNewTask(false)}
          onCreated={() => {
            refresh();
            setShowNewTask(false);
          }}
        />
      )}
    </div>
  );
}
