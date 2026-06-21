import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
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

// Adapter pattern: chuẩn hóa các kiểu lỗi khác nhau (Axios error, Error,
// unknown) về một message string duy nhất, không phụ thuộc state nào của
// component nên đặt ở module scope để không bị khai báo lại mỗi lần render.
function getErrorMessage(err: unknown, fallback: string): string {
  const axiosError = err as any;
  return (
    axiosError?.response?.data?.message || axiosError?.message || fallback
  );
}

function InfoField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function MentorTaskReviewModal({
  task,
  onClose,
  onSaved,
}: MentorTaskReviewModalProps) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);

  const handleFileAdd = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNewAttachments((prev) => [...prev, file]);
    event.target.value = "";
  }, []);

  const handleRemoveAttachment = useCallback((index: number) => {
    setNewAttachments((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const uploadAttachmentsIfAny = useCallback(async () => {
    if (newAttachments.length === 0) return;
    const formData = new FormData();
    newAttachments.forEach((file) => formData.append("files", file));
    await uploadFiles(`/tasks/${task.id}/attachments`, formData);
  }, [newAttachments, task.id]);

  const isReviewMode = task.status === "IN_REVIEW";

  const assignee = useMemo(
    () => task.intern_name ?? task.intern?.full_name ?? "Chưa gán",
    [task.intern_name, task.intern?.full_name],
  );

  const submittedAt = useMemo(() => {
    const date = task.submitted_at ?? task.updated_at;
    return date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa cập nhật";
  }, [task.submitted_at, task.updated_at]);

  const attachments = useMemo(
    () => task.task_attachments ?? [],
    [task.task_attachments],
  );

  // Factory Method pattern: mỗi loại "tài liệu nộp" (link / file đính kèm /
  // chưa nộp) có một factory dựng JSX riêng; submissionViewType chỉ chọn
  // factory phù hợp dựa trên dữ liệu, không cần if/else lồng nhau khi render.
  const submissionViewFactories = useMemo(
    () => ({
      link: () => (
        <a
          href={task.submission_link!}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 block text-base font-semibold text-sky-700 underline"
        >
          Mở liên kết nộp bài
        </a>
      ),
      attachments: () => (
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
      ),
      empty: () => (
        <p className="mt-2 text-base text-slate-700">Chưa có tài liệu nộp</p>
      ),
    }),
    [task.submission_link, attachments],
  );

  const submissionViewType: keyof typeof submissionViewFactories = task
    .submission_link
    ? "link"
    : attachments.length > 0
      ? "attachments"
      : "empty";

  // Strategy pattern: mỗi action (approve/reject) định nghĩa cách validate,
  // endpoint, payload và message lỗi riêng; runAction xử lý phần chung.
  const reviewStrategies = useMemo(
    () => ({
      approve: {
        endpoint: `/tasks/${task.id}/approve`,
        validate: () => null as string | null,
        buildPayload: () => ({ mentor_feedback: comment.trim() || null }),
        errorMessage: "Duyệt task thất bại",
      },
      reject: {
        endpoint: `/tasks/${task.id}/reject`,
        validate: () =>
          comment.trim()
            ? null
            : "Vui lòng nhập nhận xét khi yêu cầu làm lại.",
        buildPayload: () => ({ mentor_feedback: comment.trim() }),
        errorMessage: "Yêu cầu làm lại thất bại",
      },
    }),
    [task.id, comment],
  );

  const runAction = useCallback(
    async (action: keyof typeof reviewStrategies) => {
      const strategy = reviewStrategies[action];
      const validationError = strategy.validate();
      if (validationError) {
        setError(validationError);
        return;
      }
      setSubmitting(true);
      setError(null);
      try {
        await apiClient.patch(strategy.endpoint, strategy.buildPayload());
        await uploadAttachmentsIfAny();
        onSaved?.();
        onClose();
      } catch (err) {
        setError(getErrorMessage(err, strategy.errorMessage));
      } finally {
        setSubmitting(false);
      }
    },
    [reviewStrategies, uploadAttachmentsIfAny, onSaved, onClose],
  );

  const handleApprove = useCallback(() => runAction("approve"), [runAction]);
  const handleReject = useCallback(() => runAction("reject"), [runAction]);

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
              <InfoField label="Người thực hiện">
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {assignee}
                </p>
              </InfoField>
              <InfoField label="Ngày nộp">
                <p className="mt-2 text-base text-slate-700">{submittedAt}</p>
              </InfoField>
              <InfoField label="Tài liệu nộp">
                {submissionViewFactories[submissionViewType]()}
              </InfoField>
              <InfoField label="Mô tả">
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {task.description ?? "Không có mô tả"}
                </p>
              </InfoField>
              <InfoField label="Trạng thái reviews">
                <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  {displayStatusLabels[task.display_status]}
                </span>
              </InfoField>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <InfoField label="Nhận xét từ mentor">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                placeholder="Nhập nhận xét hoặc lý do yêu cầu làm lại..."
              />
            </InfoField>
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
