import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CalendarDays, Image, Paperclip, Trash2 } from "lucide-react";
import Modal from "../../../components/Modal";
import { mockInterns } from "../../../data/mockInterns";
import type { Task } from "../../../types/task";

interface EditTaskModalProps {
  task: Task;
  onSave: (updates: {
    title: string;
    description?: string;
    assigneeId?: string;
    assigneeName?: string;
    dueDate?: string;
    attachments?: string[];
  }) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const EditTaskModal = ({ task, onSave, onCancel, onDelete }: EditTaskModalProps) => {
  const [formState, setFormState] = useState({
    title: task.title,
    description: task.description,
    assigneeId: task.assigneeId || "",
    assigneeName: task.assigneeName || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    attachments: task.attachments ? [...task.attachments] : [] as string[],
  });
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormState({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId || "",
      assigneeName: task.assigneeName || "",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      attachments: task.attachments ? [...task.attachments] : [],
    });
    setError("");
  }, [task]);

  const handleAssigneeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedIntern = mockInterns.find((intern) => intern.id === selectedId);
    setFormState((current) => ({
      ...current,
      assigneeId: selectedId,
      assigneeName: selectedIntern?.fullName || "",
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;
    setFormState((current) => ({
      ...current,
      attachments: [
        ...current.attachments,
        ...selectedFiles.map((file) => file.name),
      ],
    }));
  };

  const handleRemoveAttachment = (name: string) => {
    setFormState((current) => ({
      ...current,
      attachments: current.attachments.filter((attachment) => attachment !== name),
    }));
  };

  const handleSave = () => {
    if (!formState.title.trim()) {
      setError("Tiêu đề không được để trống");
      return;
    }

    setError("");
    onSave({
      title: formState.title.trim(),
      description: formState.description,
      assigneeId: formState.assigneeId || undefined,
      assigneeName: formState.assigneeName || undefined,
      dueDate: formState.dueDate || undefined,
      attachments: formState.attachments,
    });
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="flex flex-col">
        <div className="border-b px-10 py-8">
          <h2 className="text-4xl font-black uppercase">Chi tiết công việc</h2>
        </div>

        <div className="space-y-8 px-10 py-8">
          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
              Tiêu đề nhiệm vụ
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
                Người thực hiện
              </label>
              <select
                value={formState.assigneeId}
                onChange={handleAssigneeChange}
                className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-black"
              >
                <option value="">Chọn người thực hiện...</option>
                {mockInterns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
                Hạn hoàn thành
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formState.dueDate}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-black"
                />
                <CalendarDays
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
              Mô tả công việc
            </label>
            <textarea
              rows={5}
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full resize-none rounded-xl border border-gray-200 px-5 py-4 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleChooseFile}
              className="flex h-[180px] w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:bg-slate-100"
            >
              <div className="flex items-center gap-3 text-slate-500">
                <Paperclip size={22} />
                <Image size={22} />
                <span className="font-bold tracking-wide">Đính kèm tệp hoặc ảnh</span>
              </div>
              <div className="text-sm text-slate-500">
                {formState.attachments.length > 0
                  ? `${formState.attachments.length} file đã chọn`
                  : "Chọn tệp để đính kèm"}
              </div>
            </button>

            {formState.attachments.length > 0 && (
              <div className="mt-4">
                <p className="mb-3 font-semibold text-sm text-gray-700">Tệp đính kèm</p>
                <div className="space-y-3">
                  {formState.attachments.map((attachment) => {
                    const ext = attachment.split('.').pop()?.toLowerCase() || '';
                    const isImage = ['png','jpg','jpeg','gif','webp'].includes(ext);

                    return (
                      <div
                        key={attachment}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-gray-600">
                            {isImage ? <Image size={16} /> : <Paperclip size={16} />}
                          </div>
                          <div className="max-w-[380px]">
                            <div className="truncate font-medium text-gray-900">{attachment}</div>
                            <div className="text-xs text-gray-500">{isImage ? 'Image file' : `${ext.toUpperCase() || 'FILE'}`}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(attachment)}
                            className="text-red-600 transition hover:text-red-800"
                            aria-label={`Remove ${attachment}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFileChange}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between gap-5 border-t pt-8">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-2xl border border-red-200 bg-red-50 px-6 py-3 text-red-700 transition hover:bg-red-100"
            >
              Xóa task
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-slate-900"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
