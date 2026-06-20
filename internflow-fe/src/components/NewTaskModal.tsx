import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import apiClient, { uploadFiles } from "../lib/apiClient";
import { Intern } from "../types";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function NewTaskModal({
  isOpen,
  onClose,
  onCreated,
}: NewTaskModalProps) {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [internId, setInternId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    apiClient
      .get("/interns?status=ACTIVE")
      .then((response) => {
        if (!mounted) return;
        setInterns(response.data.data ?? []);
      })
      .catch(() => {
        // ignore intern list failures for now
      });
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!internId) {
      setDueDate("");
    }
  }, [internId]);

  const today = new Date().toISOString().slice(0, 10);

  const validationError = useMemo(() => {
    if (!title.trim()) return "Tiêu đề là bắt buộc.";
    if (internId) {
      if (!dueDate) return "Chọn hạn hoàn thành khi gán người thực hiện.";
      const date = new Date(dueDate);
      if (Number.isNaN(date.getTime())) return "Hạn hoàn thành không hợp lệ.";
      if (date.getTime() < new Date().setHours(0, 0, 0, 0))
        return "Hạn hoàn thành không được là ngày trong quá khứ.";
    }
    return null;
  }, [title, internId, dueDate]);

  const handleFileAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAttachments((prev) => [...prev, file]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreate = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim() || null,
      };
      if (internId) {
        payload.intern_id = internId;
        payload.due_date = dueDate || null;
      }

      const response = await apiClient.post("/tasks", payload);
      const taskId = response.data?.data?.id;

      if (taskId && attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((file) => formData.append("files", file));
        await uploadFiles(`/tasks/${taskId}/attachments`, formData);
      }

      onCreated?.();
      onClose();
    } catch (err) {
      const axiosError = err as any;
      setError(
        axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Tạo task thất bại",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Tạo công việc mới
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              TẠO TASK MỚI
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Tiêu đề *
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Người nhận
              </span>
              <select
                value={internId}
                onChange={(e) => setInternId(e.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
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
              <p className="text-sm font-semibold text-slate-700">Hạn chót</p>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={!internId}
                min={today}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
              {!internId ? (
                <p className="text-xs text-slate-500">
                  Chọn người nhận để bật hạn chót.
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                &nbsp;
              </span>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                &nbsp;
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              Mô tả chi tiết
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Đính kèm</p>
                <p className="text-xs text-slate-500">
                  Đính kèm tệp hoặc ảnh nếu muốn.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                <UploadCloud size={16} />
                Chọn file
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileAdd}
                />
              </label>
            </div>
            <div className="space-y-3">
              {attachments.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Chưa có tài liệu đính kèm.
                </p>
              ) : (
                attachments.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {file.size} bytes
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="inline-flex items-center rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Xóa
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={handleCreate}
              disabled={saving || Boolean(validationError)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Đang tạo..." : "Tạo task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
