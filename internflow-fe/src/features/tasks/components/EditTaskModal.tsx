import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CalendarDays, FileText, Image, Paperclip, Trash2 } from "lucide-react";
import type { Task, RawTaskStatus } from "../../../types/task";
import { api } from "../../../lib/api";

interface EditTaskModalProps {
  task: Task;
  onSave: (updates: {
    title: string;
    description?: string;
    assigneeId?: string;
    assigneeName?: string;
    dueDate?: string;
    attachments?: { file_name: string; file_url?: string }[];
  }) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const rawStatusLabels: Record<RawTaskStatus, string> = {
  TODO: "TODO",
  IN_PROGRESS: "IN PROGRESS",
  IN_REVIEW: "IN REVIEW",
  DONE: "DONE",
};

const rawStatusStyles: Record<RawTaskStatus, string> = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  IN_REVIEW: "bg-amber-100 text-amber-700",
  DONE: "bg-green-100 text-green-700",
};

const EditTaskModal = ({ task, onSave, onCancel, onDelete }: EditTaskModalProps) => {
  const [formState, setFormState] = useState({
    title: task.title,
    description: task.description ?? "",
    assigneeId: task.assigneeId || "",
    assigneeName: task.assigneeName || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    attachments: task.attachments ? [...task.attachments] : [] as { file_name: string; file_url?: string }[],
  });
  const [error, setError] = useState("");
  const [interns, setInterns] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    api.getInterns().then(setInterns).catch(console.error);
  }, []);

  useEffect(() => {
    // Initial sync
    setFormState({
      title: task.title,
      description: task.description ?? "",
      assigneeId: task.assigneeId || "",
      assigneeName: task.assigneeName || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      attachments: task.attachments ? [...task.attachments] : [],
    });
    setError("");

    // Fetch full details for attachments
    api.getTaskById(task.id)
      .then((fullTask) => {
        setFormState((prev) => ({
          ...prev,
          attachments: fullTask.attachments ? fullTask.attachments : [],
        }));
      })
      .catch(console.error);
  }, [task]);

  const handleAssigneeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedIntern = interns.find((intern) => intern.id === selectedId);
    setFormState((current) => ({
      ...current,
      assigneeId: selectedId,
      assigneeName: selectedIntern?.full_name || "",
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    setFormState((current) => ({
      ...current,
      attachments: [
        ...current.attachments,
        ...selectedFiles.map((file) => ({ file_name: file.name, file })),
      ],
    }));
  };

  const handleRemoveAttachment = (name: string) => {
    setFormState((current) => ({
      ...current,
      attachments: current.attachments.filter((a) => a.file_name !== name),
    }));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleSave = async () => {
    if (!formState.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }
    setError("");
    setIsUploading(true);

    try {
      const finalAttachments = [];
      for (const att of formState.attachments) {
        if ((att as any).file) {
          const res = await api.uploadFile((att as any).file);
          finalAttachments.push({ file_name: res.name, file_url: res.url });
        } else {
          finalAttachments.push({ file_name: att.file_name, file_url: att.file_url });
        }
      }

      onSave({
        title: formState.title.trim(),
        description: formState.description,
        assigneeId: formState.assigneeId || undefined,
        assigneeName: formState.assigneeName || undefined,
        dueDate: formState.dueDate || undefined,
        attachments: finalAttachments,
      });
    } catch (err: any) {
      setError(err.message || "Lỗi khi upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const selectedInternObj = interns.find((i) => i.id === formState.assigneeId);
  const initials = selectedInternObj
    ? selectedInternObj.full_name.split(" ").map((w: string) => w[0]).slice(-2).join("")
    : null;

  const isReadOnly = selectedInternObj ? selectedInternObj.status !== 'ACTIVE' : false;

  return (
    <div className="flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-7 pt-7 pb-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Chi tiết công việc</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${rawStatusStyles[task.rawStatus]}`}
        >
          {rawStatusLabels[task.rawStatus]}
        </span>
      </div>

      {isReadOnly && (
        <div className="bg-amber-50 px-7 py-3 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <strong>Chỉ xem:</strong> Thực tập sinh này đã kết thúc thực tập (Trạng thái: {selectedInternObj?.status}). Không thể chỉnh sửa task.
        </div>
      )}

      {/* ── Body ── */}
      <div className="px-7 py-6 space-y-5">
        {/* Title */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Tiêu đề công việc
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            value={formState.title}
            onChange={(e) => setFormState((c) => ({ ...c, title: e.target.value }))}
            className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 ${
              error ? "border-red-400" : "border-gray-200"
            } ${isReadOnly ? "bg-gray-50 cursor-not-allowed text-gray-500" : "bg-white"}`}
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>

        {/* Assignee + Due Date */}
        <div className="grid grid-cols-2 gap-4">
          {/* Assignee */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Người thực hiện
            </label>
            <div className="relative flex items-center rounded-lg border border-gray-200 bg-white transition focus-within:border-gray-400">
              {initials ? (
                <div className="ml-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                  {initials}
                </div>
              ) : null}
              <select
                disabled={isReadOnly}
                value={formState.assigneeId}
                onChange={handleAssigneeChange}
                className={`w-full appearance-none bg-transparent py-3 pr-9 text-sm outline-none ${
                  initials ? "pl-2" : "pl-4"
                } ${isReadOnly ? "cursor-not-allowed text-gray-500" : "text-gray-800"}`}
              >
                <option value="">Chọn thực tập sinh...</option>
                {interns.map((intern) => {
                  const isSelectable = intern.status === 'ACTIVE' || intern.id === task.assigneeId;
                  return (
                    <option 
                      key={intern.id} 
                      value={intern.id}
                      disabled={!isSelectable}
                    >
                      {intern.full_name} {intern.status !== 'ACTIVE' ? `(${intern.status})` : ''}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute right-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Hạn hoàn thành
            </label>
            <div className="relative flex items-center rounded-lg border border-gray-200 transition focus-within:border-gray-400">
              <CalendarDays size={15} className="ml-3 flex-shrink-0 text-gray-400" />
              <input
                type="date"
                disabled={isReadOnly}
                value={formState.dueDate}
                onChange={(e) => setFormState((c) => ({ ...c, dueDate: e.target.value }))}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full bg-transparent py-3 pl-2 pr-4 text-sm outline-none ${
                  isReadOnly ? "cursor-not-allowed text-gray-500" : "text-gray-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Mô tả công việc
          </label>
          <textarea
            rows={4}
            disabled={isReadOnly}
            value={formState.description}
            onChange={(e) => setFormState((c) => ({ ...c, description: e.target.value }))}
            className={`w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 ${
              isReadOnly ? "bg-gray-50 cursor-not-allowed text-gray-500" : "text-gray-800 bg-white"
            }`}
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
            Tài liệu đính kèm
            {formState.attachments.length > 0 && (
              <span className="ml-1 text-gray-500">({formState.attachments.length})</span>
            )}
          </label>

          {formState.attachments.length > 0 && (
            <div className="mb-3 space-y-2 rounded-lg border border-gray-200 p-2">
              {formState.attachments.map((attachment, idx) => {
                const ext = attachment.file_name.split(".").pop()?.toLowerCase() || "";
                const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
                const isPdf = ext === "pdf";

                return (
                  <div
                    key={`${attachment.file_name}-${idx}`}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500">
                        {isImage ? <Image size={16} /> : isPdf ? <FileText size={16} /> : <Paperclip size={16} />}
                      </div>
                      <div className="min-w-0">
                        {attachment.file_url ? (
                           <a href={`http://localhost:4000${attachment.file_url}`} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-blue-600 hover:underline block">{attachment.file_name}</a>
                        ) : (
                           <p className="truncate text-sm font-medium text-gray-800">{attachment.file_name}</p>
                        )}
                        <p className="text-xs text-gray-400">{isImage ? "Image file" : `${ext.toUpperCase() || "FILE"}`}</p>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(attachment.file_name)}
                        className="ml-3 flex-shrink-0 rounded-md p-1.5 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 py-3 text-sm text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
              >
                <Paperclip size={15} />
                Thêm tệp đính kèm
              </button>
              <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileChange} />
            </>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100">
        {!isReadOnly ? (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={15} />
            Xóa task
          </button>
        ) : (
          <div></div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
          >
            {isReadOnly ? "Đóng" : "Hủy"}
          </button>
          {!isReadOnly && (
            <button
              type="button"
              disabled={isUploading}
              onClick={handleSave}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition ${
                isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-black"
              }`}
            >
              {isUploading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
