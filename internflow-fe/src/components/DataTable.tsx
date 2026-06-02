import { useState } from "react";
import { Download, GraduationCap, Mail, Phone } from "lucide-react";
import Badge from "./Badge";
import InternEvaluationModal from "./InternEvaluationModal";
import Modal from "./Modal";
import SkeletonRow from "./SkeletonRow";
import { InternStatus, type Intern } from "../types/intern";
import { useInterns } from "../hooks/useInterns";
import { getInternDetails } from "../data/internDetails";

interface DataTableProps {
  page: number;
  limit: number;
}

const DataTable = ({ page, limit }: DataTableProps) => {
  const { data, isLoading } = useInterns({ page, limit });
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const openInternModal = (intern: Intern) => setSelectedIntern(intern);
  const closeInternModal = () => setSelectedIntern(null);
  const openReviewModal = () => setIsReviewOpen(true);
  const closeReviewModal = () => setIsReviewOpen(false);

  const internDetailsData = selectedIntern ? getInternDetails(selectedIntern.id) : null;
  const taskStats = internDetailsData?.taskStats || [];
  const workHistory = internDetailsData?.workHistory || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* ── Table ── */}
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b text-left">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Họ tên & Mã số</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Vị trí</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Số điện thoại</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {!isLoading &&
              data.map((intern) => (
                <tr
                  key={intern.id}
                  onClick={() => openInternModal(intern)}
                  className="cursor-pointer border-b transition hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-sm font-bold text-gray-700">
                        {intern.fullName.split(" ").map((w) => w[0]).slice(-2).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{intern.fullName}</p>
                        <p className="text-xs text-gray-400">{intern.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge label={intern.position} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{intern.email}</td>

                  <td className="px-6 py-4 text-sm text-gray-600">{intern.phone}</td>

                  <td className="px-6 py-4">
                    <Badge
                      label={intern.status}
                      variant={intern.status === InternStatus.INTERNING ? "success" : "default"}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Intern Detail Modal ── */}
      <Modal isOpen={Boolean(selectedIntern)} onClose={closeInternModal}>
        {selectedIntern && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="px-7 pt-7 pb-5 border-b border-gray-100">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                Thông tin thực tập sinh
              </p>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6">
              {/* Profile */}
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xl font-black text-white">
                  {selectedIntern.fullName.split(" ").map((w) => w[0]).slice(-2).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{selectedIntern.fullName}</h2>
                    <Badge
                      label={selectedIntern.status}
                      variant={selectedIntern.status === InternStatus.INTERNING ? "success" : "default"}
                    />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{selectedIntern.position}</p>
                </div>
              </div>

              {/* Contact row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span>{selectedIntern.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{selectedIntern.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={14} className="text-gray-400" />
                  <span>HUST</span>
                </div>
              </div>

              {/* Stats */}
              {taskStats.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {taskStats.map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        {stat.label}
                      </p>
                      <p
                        className={`mt-2 text-2xl font-black ${
                          idx === taskStats.length - 1 && stat.value !== "0"
                            ? "text-red-500"
                            : "text-gray-900"
                        }`}
                      >
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Work History */}
              {workHistory.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                    Lịch sử công việc
                  </p>
                  <div className="space-y-2">
                    {workHistory.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                          <p className="mt-0.5 text-xs text-gray-400">{item.date}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            item.status === "HOÀN THÀNH"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100">
              <button
                onClick={closeInternModal}
                className="px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:text-gray-800"
              >
                Đóng
              </button>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                  <Download size={15} />
                  Tải CV
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openReviewModal();
                  }}
                  className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M12.5 4.5l-7 7L2 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Tiến hành đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Evaluation Modal ── */}
      <InternEvaluationModal
        isOpen={isReviewOpen}
        onClose={closeReviewModal}
        intern={selectedIntern}
      />

      {/* ── Pagination ── */}
      <div className="flex items-center justify-end gap-2 px-6 py-4">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-600 transition hover:bg-gray-200">
          ←
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
          1
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-600 transition hover:bg-gray-200">
          →
        </button>
      </div>
    </div>
  );
};

export default DataTable;
