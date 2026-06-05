import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, Image, LoaderCircle, Paperclip } from "lucide-react";

import Modal from "../../../components/Modal";
import { api } from "../../../lib/api";
import type { Task } from "../../../types/task";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Task) => void;
}

interface TaskFormValues {
  title: string;
  assigneeId: string;
  dueDate: string;
  description: string;
}

const CreateTaskModal = ({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getInterns("ACTIVE").then(setInterns).catch(console.error);
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>();

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Upload files first if any
      const attachments = [];
      if (files.length > 0) {
        for (const file of files) {
          const uploaded = await api.uploadFile(file);
          attachments.push({
            file_name: uploaded.name,
            file_url: uploaded.url,
            file_size: uploaded.size,
            type: uploaded.type.includes("image") ? "IMAGE" : "FILE",
          });
        }
      }

      // 2. Create task
      if (data.assigneeId) {
        // Create assigned task
        await api.createTask({
          title: data.title,
          description: data.description,
          intern_id: data.assigneeId,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        });
      } else {
        // Create unassigned task
        await api.createTask({
          title: data.title,
          description: data.description,
          attachments: attachments.length > 0 ? attachments : undefined,
        });
      }
      onCreateTask({} as any); // trigger refetch
      reset();
      setFiles([]);
      onClose();
    } catch (err) {
      console.error("Create task failed:", err);
      alert(err instanceof Error ? err.message : "Tạo task thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">
            Tạo công việc mới
          </h2>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-7 py-6 space-y-5">
            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên nhiệm vụ..."
                {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-gray-400 ${
                  errors.title ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Assignee + Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {/* Assignee */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Người nhận
                </label>
                <div className="relative">
                  <select
                    {...register("assigneeId")}
                    className={`w-full appearance-none rounded-lg border py-3 pl-4 pr-9 text-sm text-gray-800 outline-none transition focus:border-gray-400 ${
                      errors.assigneeId ? "border-red-400" : "border-gray-200"
                    }`}
                  >
                    <option value="">Chọn thành viên phụ trách...</option>
                    {interns.map((intern) => (
                      <option key={intern.id} value={intern.id}>
                        {intern.full_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                {errors.assigneeId && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.assigneeId.message}</p>
                )}
              </div>

              {/* Due date */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Hạn chót
                </label>
                <div className="relative flex items-center rounded-lg border border-gray-200 transition focus-within:border-gray-400">
                  <input
                    type="date"
                    {...register("dueDate", {
                      validate: (value, formValues) => {
                        if (formValues.assigneeId && !value) {
                          return "Vui lòng chọn ngày khi đã gán người thực hiện";
                        }
                        return true;
                      }
                    })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent py-3 pl-4 pr-10 text-sm text-gray-800 outline-none"
                  />
                  <CalendarDays size={15} className="absolute right-3 text-gray-400 pointer-events-none" />
                </div>
                {errors.dueDate && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                Mô tả chi tiết
              </label>
              <textarea
                rows={4}
                placeholder="Viết ghi chú chi tiết cho nhiệm vụ này..."
                {...register("description")}
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-300 focus:border-gray-400"
              />
            </div>

            {/* File attachment */}
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[110px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2 text-gray-400">
                  <Paperclip size={18} />
                  <Image size={18} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Đính kèm tệp hoặc ảnh
                  </span>
                </div>
                {files.length > 0 && (
                  <p className="text-xs text-gray-400">{files.length} file đã chọn</p>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
