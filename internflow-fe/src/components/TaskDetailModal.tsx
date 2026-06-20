import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Trash2, UploadCloud, X } from 'lucide-react';
import apiClient, { uploadFiles } from '../lib/apiClient';
import { Intern, Task, TaskAttachment } from '../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onSaved?: () => void;
  onDeleted?: () => void;
  readOnly?: boolean;
}

const rawStatusStyles: Record<Task['status'], string> = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-sky-100 text-sky-700',
  IN_REVIEW: 'bg-violet-100 text-violet-700',
  DONE: 'bg-emerald-100 text-emerald-700'
};

const displayStatusLabels: Record<Task['display_status'], string> = {
  UNASSIGNED: 'Chưa gán',
  IN_PROGRESS: 'Đang làm',
  NEEDS_REVISION: 'Cần sửa',
  WAITING_REVIEW: 'Chờ duyệt',
  COMPLETED: 'Hoàn thành',
  OVERDUE: 'Trễ hạn'
};

const formatDateForInput = (value: string | null | undefined) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export default function TaskDetailModal({ task, onClose, onSaved, onDeleted, readOnly = false }: TaskDetailModalProps) {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [internId, setInternId] = useState(task.intern_id ?? '');
  const [dueDate, setDueDate] = useState(formatDateForInput(task.due_date as string | null | undefined));
  const [attachments, setAttachments] = useState<TaskAttachment[]>(task.task_attachments ?? []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const canEdit = !readOnly && (task.status === 'TODO' || task.status === 'IN_PROGRESS');
  const isTodo = task.status === 'TODO';
  const isInProgress = task.status === 'IN_PROGRESS';

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    apiClient
      .get(`/tasks/${task.id}`)
      .then((response) => {
        if (!mounted) return;
        const responseData = response.data.data as Task & { task_attachments?: TaskAttachment[] };
        setTitle(responseData.title);
        setDescription(responseData.description ?? '');
        setInternId(responseData.intern_id ?? '');
        setDueDate(formatDateForInput(responseData.due_date as string | null | undefined));
        setAttachments(responseData.task_attachments ?? []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || err.message || 'Không tải được chi tiết task');
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    apiClient
      .get('/interns?status=ACTIVE')
      .then((response) => {
        if (!mounted) return;
        setInterns(response.data.data ?? []);
      })
      .catch(() => {
        // Ignore intern list errors for now
      });

    return () => {
      mounted = false;
    };
  }, [task.id]);


  const handleFileAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingFiles((prev) => [...prev, file]);
    event.target.value = '';
  };

  const handlePendingFileRemove = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const validationError = useMemo(() => {
    if (!title.trim()) {
      return 'Tiêu đề là bắt buộc.';
    }
    if (isTodo && internId && !dueDate) {
      return 'Chọn hạn hoàn thành khi gán người thực hiện.';
    }
    if (isInProgress && !internId) {
      return 'Task IN_PROGRESS phải có người thực hiện.';
    }
    if ((isInProgress || (isTodo && internId)) && dueDate) {
      const date = new Date(dueDate);
      if (Number.isNaN(date.getTime())) {
        return 'Hạn hoàn thành không hợp lệ.';
      }
      if (date.getTime() < new Date().setHours(0, 0, 0, 0)) {
        return 'Hạn hoàn thành không được là ngày trong quá khứ.';
      }
    }
    return null;
  }, [title, internId, dueDate, isInProgress, isTodo]);

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa task này không?')) {
      return;
    }
    setDeleting(true);
    try {
      await apiClient.delete(`/tasks/${task.id}`);
      onDeleted?.();
      onClose();
    } catch (err) {
      const axiosError = err as any;
      setError(axiosError?.response?.data?.message || axiosError?.message || 'Xóa task thất bại');
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim() || null
      };

      if (isTodo) {
        if (internId) {
          await apiClient.patch(`/tasks/${task.id}`, payload);
          await apiClient.patch(`/tasks/${task.id}/assign`, {
            intern_id: internId,
            due_date: dueDate
          });
        } else {
          await apiClient.patch(`/tasks/${task.id}`, payload);
        }
      } else if (isInProgress) {
        payload.due_date = dueDate || null;
        await apiClient.patch(`/tasks/${task.id}`, payload);
      }

      if (pendingFiles.length > 0) {
        const formData = new FormData();
        pendingFiles.forEach((file) => formData.append('files', file));
        await uploadFiles(`/tasks/${task.id}/attachments`, formData);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      const axiosError = err as any;
      setError(axiosError?.response?.data?.message || axiosError?.message || 'Lưu task thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Chi tiết công việc</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title || '...'}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${rawStatusStyles[task.status]}`}>
            {task.status}
          </span>
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {displayStatusLabels[task.display_status]}
          </span>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            <div className="h-4 w-1/2 rounded-full bg-slate-200"></div>
            <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
            <div className="h-72 rounded-3xl bg-slate-100"></div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Tiêu đề công việc</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!canEdit}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Người thực hiện</span>
                <select
                  value={internId}
                  onChange={(e) => setInternId(e.target.value)}
                  disabled={!canEdit}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">Chưa gán</option>
                  {interns.map((intern) => (
                    <option key={intern.id} value={intern.id}>
                      {intern.full_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Hạn hoàn thành</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={!canEdit || (isTodo && !internId)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
                {isTodo && !internId ? (
                  <p className="text-xs text-slate-500">Chọn người thực hiện trước khi chọn hạn hoàn thành.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Trạng thái hiện tại</p>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {task.status}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Mô tả công việc</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canEdit}
                rows={6}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Tài liệu đính kèm</p>
                  <p className="text-xs text-slate-500">Mentor có thể thêm/xóa file nếu task chưa bị khóa.</p>
                </div>
                <label className={`inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}>
                  <UploadCloud size={16} />
                  Thêm file
                  <input type="file" className="hidden" disabled={!canEdit} onChange={handleFileAdd} />
                </label>
              </div>

              <div className="space-y-3">
                {attachments.length === 0 && pendingFiles.length === 0 ? (
                  <p className="text-sm text-slate-500">Chưa có tài liệu đính kèm.</p>
                ) : (
                  <>
                    {attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.file_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300"
                      >
                        <div>
                          <p className="font-medium text-slate-900 underline">{attachment.file_name}</p>
                          <p className="text-xs text-slate-500">{attachment.file_size ? `${attachment.file_size} bytes` : 'Kích thước không rõ'}</p>
                        </div>
                      </a>
                    ))}
                    {pendingFiles.map((file, index) => (
                      <div key={`pending-${file.name}-${index}`} className="flex items-center justify-between rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-amber-600">Chưa lưu — sẽ upload khi bấm "Lưu thay đổi"</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePendingFileRemove(index)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {task.status === 'TODO' && !readOnly ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? 'Đang xóa...' : 'Xóa task'}
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
          {canEdit ? (
            <button
              onClick={handleSave}
              disabled={saving || Boolean(validationError)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
