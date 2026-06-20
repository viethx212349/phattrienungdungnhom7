import { ChangeEvent, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import apiClient, { uploadFiles } from "../lib/apiClient";
import { Task } from "../types";

interface MentorTaskReviewModalProps {
  task: Task;
  onClose: () => void;
  onSaved?: () => void;
}

const displayStatusLabels: Record<Task["display_status"], string> = {
  UNASSIGNED: "Chưa gán",
  IN_PROGRESS: "Đang làm",
  NEEDS_REVISION: "Cần sửa",
  WAITING_REVIEW: "Chờ duyệt",
  COMPLETED: "Hoàn thành",
  OVERDUE: "Trễ hạn",
};

export default function MentorTaskReviewModal({
  task,
  onClose,
  onSaved,
}: MentorTaskReviewModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

  const handleFileAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNewAttachments((prev) => [...prev, file]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setNewAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const uploadAttachmentsIfAny = async () => {
    if (newAttachments.length === 0) return;
    const formData = new FormData();
    newAttachments.forEach((file) => formData.append("files", file));
    await uploadFiles(`/tasks/${task.id}/attachments`, formData);
  };

  const isReviewMode = task.status === "IN_REVIEW";
  const assignee = task.intern_name ?? task.intern?.full_name ?? "Chưa gán";
  const submittedAt = task.submitted_at
    ? new Date(task.submitted_at).toLocaleDateString("vi-VN")
    : task.updated_at
      ? new Date(task.updated_at).toLocaleDateString("vi-VN")
      : "Chưa cập nhật";

  const submissionLink = task.submission_link;
  const attachments = task.task_attachments ?? [];

  const handleApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/tasks/${task.id}/approve`, {
        mentor_feedback: comment.trim() || null,
      });
      await uploadAttachmentsIfAny();
      onSaved?.();
      onClose();
    } catch (err) {
      const axiosError = err as any;
      setError(
        axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Duyệt task thất bại",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setError("Vui lòng nhập nhận xét khi yêu cầu làm lại.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/tasks/${task.id}/reject`, {
        mentor_feedback: comment.trim(),
      });
      await uploadAttachmentsIfAny();
      onSaved?.();
      onClose();
    } catch (err) {
      const axiosError = err as any;
      setError(
        axiosError?.response?.data?.message ||
          axiosError?.message ||
          "Yêu cầu làm lại thất bại",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Nghiệm thu công việc
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Người thực hiện
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {assignee}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Ngày nộp
                </p>
                <p className="mt-2 text-base text-slate-700">{submittedAt}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Tài liệu nộp
                </p>
                {submissionLink ? (
                  <a
                    href={submissionLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 block text-base font-semibold text-sky-700 underline"
                  >
                    Mở liên kết nộp bài
                  </a>
                ) : attachments.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.file_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="block rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300"
                      >
                        {attachment.file_name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-base text-slate-700">
                    Chưa có tài liệu nộp
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Mô tả
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {task.description ?? "Không có mô tả"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Trạng thái reviews
                </p>
                <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {displayStatusLabels[task.display_status]}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Nhận xét từ mentor
              </p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="Nhập nhận xét hoặc lý do yêu cầu làm lại..."
              />
            </div>
            {isReviewMode ? (
              <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Đính kèm file
                  </p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-100">
                    <UploadCloud size={14} />
                    Chọn file
                    <input type="file" className="hidden" onChange={handleFileAdd} />
                  </label>
                </div>
                {newAttachments.length > 0 ? (
                  <div className="space-y-2">
                    {newAttachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                      >
                        <span className="text-slate-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="rounded-xl bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                {error}
              </div>
            ) : null}
            {isReviewMode ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={handleReject}
                  disabled={submitting}
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "Yêu cầu làm lại"}
                </button>
               {/* từ chối duyệt task */}
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Đang gửi..." : "Duyệt task"}
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                Chỉ xem thông tin nhiệm thu task.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
