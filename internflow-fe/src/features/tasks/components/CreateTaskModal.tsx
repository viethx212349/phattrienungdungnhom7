import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, Image, LoaderCircle, Paperclip } from "lucide-react"; //icon react

import Modal from "../../../components/Modal";
import { mockInterns } from "../../../data/mockInterns";
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>();

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const chosenIntern = mockInterns.find(
      (intern) => intern.id === data.assigneeId,
    );

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      assigneeId: data.assigneeId || undefined,
      assigneeName: chosenIntern?.fullName,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      rawStatus: "TODO",
      displayStatus: data.assigneeId ? "IN_PROGRESS" : "UNASSIGNED",
      attachments: files.map((file) => file.name),
    };

    onCreateTask(newTask);

    setIsSubmitting(false);

    reset();

    onClose();
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    setFiles(selectedFiles);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        <div className="border-b px-10 py-8">
          <h2 className="text-4xl font-black uppercase">Tạo công việc mới</h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-10 py-8"
        >
          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
              Tiêu đề <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              placeholder="Nhập tên nhiệm vụ..."
              {...register("title", {
                required: "Vui lòng nhập tiêu đề",
              })}
              className={`w-full rounded-xl border px-5 py-4 outline-none transition ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-200 focus:border-black"
              }`}
            />

            {errors.title && (
              <p className="mt-2 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
                Người nhận <span className="text-red-500">*</span>
              </label>

              <select
                {...register("assigneeId", {
                  required: "Vui lòng chọn người nhận",
                })}
                className={`w-full rounded-xl border px-5 py-4 outline-none transition ${
                  errors.assigneeId
                    ? "border-red-500"
                    : "border-gray-200 focus:border-black"
                }`}
              >
                <option value="">Chọn thành viên phụ trách...</option>

                {mockInterns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.fullName}
                  </option>
                ))}
              </select>

              {errors.assigneeId && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
                Hạn chót <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <input
                  type="date"
                  {...register("dueDate", {
                    required: "Vui lòng chọn ngày hạn chót",
                  })}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full rounded-xl border px-5 py-4 outline-none transition ${
                    errors.dueDate
                      ? "border-red-500"
                      : "border-gray-200 focus:border-black"
                  }`}
                />

                <CalendarDays
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              {errors.dueDate && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold uppercase tracking-wider text-gray-500">
              Mô tả chi tiết
            </label>

            <textarea
              rows={5}
              placeholder="Viết ghi chú chi tiết cho nhiệm vụ này..."
              {...register("description")}
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

                <span className="font-bold tracking-wide">
                  ĐÍNH KÈM TỆP HOẶC ẢNH
                </span>
              </div>

              {files.length > 0 ? (
                <div className="text-sm text-slate-500">
                  {files.length} file đã chọn
                </div>
              ) : (
                <div className="text-sm text-slate-500">
                  Chọn tệp để đính kèm
                </div>
              )}
            </button>

            {files.length > 0 && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="mb-2 font-semibold">Tên tệp đã chọn</p>
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li key={file.name} className="break-words">
                      • {file.name}
                    </li>
                  ))}
                </ul>
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

          <div className="flex items-center justify-end gap-5 border-t pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-bold text-gray-500 transition hover:text-black"
            >
              HỦY
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-w-[170px] items-center justify-center gap-3 rounded-xl bg-gray-700 px-8 py-4 font-bold uppercase tracking-wider text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={20} className="animate-spin" />
                  Loading...
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
