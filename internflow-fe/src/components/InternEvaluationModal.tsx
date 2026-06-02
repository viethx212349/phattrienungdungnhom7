import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-3xl rounded-[30px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Đánh giá Thực tập sinh</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">{intern.fullName}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-slate-500">{intern.position}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-slate-900 text-3xl font-black text-white">
            {intern.fullName
              .split(" ")
              .map((word) => word[0])
              .slice(-2)
              .join("")}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-700">
              <Mail size={18} />
              <span>{intern.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone size={18} />
              <span>{intern.phone}</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            Nhận xét chung từ mentor <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={6}
            placeholder="Nhập đánh giá chi tiết về quá trình làm việc, kỹ năng chuyên môn và thái độ của thực tập sinh..."
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>

        <div className="mt-8 rounded-[30px] border border-slate-200 bg-slate-50 p-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Quyết định cuối cùng</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDecision("PASS")}
              className={`flex items-center gap-4 rounded-[28px] border px-5 py-4 text-left transition ${
                decision === "PASS"
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                ✓
              </div>
              <div>
                <p className="font-semibold text-slate-900">Đạt (PASS)</p>
                <p className="mt-1 text-sm text-slate-500">Đủ điều kiện chính thức.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDecision("FAIL")}
              className={`flex items-center gap-4 rounded-[28px] border px-5 py-4 text-left transition ${
                decision === "FAIL"
                  ? "border-rose-300 bg-rose-50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white">
                ✕
              </div>
              <div>
                <p className="font-semibold text-slate-900">Không đạt (FAIL)</p>
                <p className="mt-1 text-sm text-slate-500">Chưa đạt yêu cầu.</p>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Xác nhận đánh giá
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InternEvaluationModal;
