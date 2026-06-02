import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { Intern } from "../types/intern";

interface InternEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  intern: Intern | null;
}

const InternEvaluationModal = ({ isOpen, onClose, intern }: InternEvaluationModalProps) => {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"PASS" | "FAIL">("PASS");

  useEffect(() => {
    if (!isOpen) {
      setComment("");
      setDecision("PASS");
    }
  }, [isOpen]);

  if (!intern) return null;

  const initials = intern.fullName.split(" ").map((w) => w[0]).slice(-2).join("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col">
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Đánh giá Thực tập sinh</h2>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
              {initials}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{intern.fullName}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block" />
                <span className="uppercase tracking-wider">{intern.position}</span>
              </p>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Nhận xét chung từ mentor <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Nhập đánh giá chi tiết về quá trình làm việc, kỹ năng chuyên môn và thái độ của thực tập sinh..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white"
            />
          </div>

          {/* Decision */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
              Quyết định cuối cùng
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* PASS */}
              <button
                type="button"
                onClick={() => setDecision("PASS")}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  decision === "PASS"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Đạt (PASS)</p>
                    <p className="text-xs text-gray-400">Đủ điều kiện chính thức.</p>
                  </div>
                </div>
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                    decision === "PASS" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                  }`}
                >
                  {decision === "PASS" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* FAIL */}
              <button
                type="button"
                onClick={() => setDecision("FAIL")}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                  decision === "FAIL"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white text-sm font-bold">
                    ✕
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Không Đạt (FAIL)</p>
                    <p className="text-xs text-gray-400">Chưa đạt yêu cầu.</p>
                  </div>
                </div>
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                    decision === "FAIL" ? "border-red-500 bg-red-500" : "border-gray-300"
                  }`}
                >
                  {decision === "FAIL" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
          >
            Xác nhận đánh giá
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InternEvaluationModal;
