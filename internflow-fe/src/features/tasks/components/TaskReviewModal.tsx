import { useEffect, useState } from "react";
import { CalendarDays, Link2, X } from "lucide-react";
import type { Task } from "../../../types/task";
import { api } from "../../../lib/api";

interface TaskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onApprove: (taskId: string, feedback: string) => Promise<void>;
  onReject: (taskId: string, feedback: string) => Promise<void>;
}

const TaskReviewModal = ({
  isOpen,
  onClose,
  task,
  onApprove,
  onReject,
}: TaskReviewModalProps) => {
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionLink, setSubmissionLink] = useState<string | null>(null);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      setFeedback("");
      setError("");
      setSubmissionLink(null);
      setSubmittedAt(task.submittedAt || null);

      // Fetch full task detail to get submission_link
      api.getTaskById(task.id)
        .then((detail: any) => {
          setSubmissionLink(detail.submission_link || null);
          if (detail.submitted_at) {
            setSubmittedAt(detail.submitted_at);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, task]);

  if (!task) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(task.id, feedback);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duyệt task thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError("Vui lòng nhập nhận xét/lý do yêu cầu làm lại.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onReject(task.id, feedback);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yêu cầu làm lại thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString("vi-VN")
    : "Chưa nộp";

  const initials = task.assigneeName
    ? task.assigneeName.split(" ").map((w) => w[0]).slice(-2).join("")
    : "?";

  return (
    <div className="flex flex-col relative">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={20} />
      </button>

      {/* ── Header ── */}
      <div className="px-7 pt-7 pb-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Nghiệm thu công việc</h2>
      </div>

      {/* ── Body ── */}
      <div className="px-7 py-6">
        {/* Info Box */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Tên công việc
            </p>
            <p className="text-base font-semibold text-gray-900">{task.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Người thực hiện
              </p>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {task.assigneeName || "Không rõ"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                Ngày nộp
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <CalendarDays size={16} className="text-gray-500" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
              Tài liệu đính kèm
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              <Link2 size={16} className="text-gray-500" />
              {submissionLink ? (
                <a
                  href={submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Link báo cáo đính kèm
                </a>
              ) : (
                <span className="text-gray-500 italic">Không có tài liệu</span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="mt-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-900">
            Nhận xét từ Mentor <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
              if (error) setError("");
            }}
            placeholder="Nhập nhận xét hoặc lý do yêu cầu làm lại..."
            className={`w-full resize-none rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:bg-white focus:border-gray-400 ${
              error ? "border-red-400" : "border-gray-100"
            }`}
          />
          {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleReject}
          disabled={isSubmitting}
          className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
        >
          YÊU CẦU LÀM LẠI
        </button>
        <button
          type="button"
          onClick={handleApprove}
          disabled={isSubmitting}
          className="rounded-lg bg-[#2e7d32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1b5e20] disabled:opacity-60"
        >
          DUYỆT TASK
        </button>
      </div>
    </div>
  );
};

export default TaskReviewModal;
