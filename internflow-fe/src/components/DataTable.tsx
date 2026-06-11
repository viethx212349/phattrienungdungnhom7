import { useState, useEffect } from "react";
import { Download, GraduationCap, Mail, Phone } from "lucide-react";
import Badge from "./Badge";
import InternEvaluationModal from "./InternEvaluationModal";
import Modal from "./Modal";
import SkeletonRow from "./SkeletonRow";
import { InternStatus, type Intern } from "../types/intern";
import { useInterns } from "../hooks/useInterns";
import { api } from "../lib/api";

interface DataTableProps {
  page: number;
  limit: number;
}

const DataTable = ({ page, limit }: DataTableProps) => {
  const { data, isLoading, refetch } = useInterns({ page, limit });
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [internDetails, setInternDetails] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    if (selectedIntern) {
      api.getInternById(selectedIntern.id)
        .then(data => setInternDetails(data))
        .catch(console.error);
    } else {
      setInternDetails(null);
    }
  }, [selectedIntern]);

  const openInternModal = (intern: Intern) => setSelectedIntern(intern);
  const closeInternModal = () => {
    setSelectedIntern(null);
    setInternDetails(null);
  };
  const openReviewModal = () => setIsReviewOpen(true);
  const closeReviewModal = () => setIsReviewOpen(false);

  const taskStats = [
    { label: "TỔNG TASK", value: internDetails?.total_tasks ?? 0 },
    { label: "HOÀN THÀNH", value: internDetails?.completed_count ?? 0 },
    { label: "TRỄ HẠN", value: internDetails?.overdue_count ?? 0 },
  ];
  const workHistory = internDetails?.task_history || [];

  const getStatusLabel = (status: string) => {
    if (status === 'ACTIVE') return 'Đang thực tập';
    if (status === 'PASSED') return 'Đã đạt';
    if (status === 'FAILED') return 'Không đạt';
    return status;
  };

  const getStatusVariant = (status: string) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'PASSED') return 'default';
    if (status === 'FAILED') return 'error';
    return 'default';
  };

  const badgeStyles: Record<string, string> = {
    "Hoàn thành": "bg-green-100 text-green-700",
    "Trễ hạn": "bg-red-100 text-red-600",
    "Chờ duyệt": "bg-amber-100 text-amber-700",
    "Cần sửa": "bg-orange-100 text-orange-700",
    "Đang làm": "bg-blue-100 text-blue-700",
    "Chưa giao": "bg-gray-100 text-gray-600",
  };

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
                  {internDetails?.full_name?.split(" ").map((w: string) => w[0]).slice(-2).join("") || selectedIntern.fullName.split(" ").map((w: string) => w[0]).slice(-2).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{internDetails?.full_name || selectedIntern.fullName}</h2>
                    <Badge
                      label={getStatusLabel(internDetails?.status || 'ACTIVE')}
                      variant={getStatusVariant(internDetails?.status || 'ACTIVE')}
                    />
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{internDetails?.position || selectedIntern.position}</p>
                </div>
              </div>

              {/* Contact row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  <span>{internDetails?.email || selectedIntern.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  <span>{internDetails?.phone || selectedIntern.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={14} className="text-gray-400" />
                  <span>{internDetails?.school || "Chưa cập nhật"}</span>
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
                          stat.label === "TRỄ HẠN" && stat.value > 0
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
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {workHistory.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : 'Không có deadline'}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            badgeStyles[item.display_status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.display_status.toUpperCase()}
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
                <button
                  disabled={!internDetails?.cv_link}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                    internDetails?.cv_link 
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                      : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (internDetails?.cv_link) window.open(internDetails.cv_link, "_blank");
                  }}
                >
                  <Download size={15} />
                  Tải CV
                </button>
                {internDetails?.status === 'ACTIVE' && (
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
                )}
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
        onEvaluate={() => {
          closeReviewModal();
          closeInternModal();
          refetch();
        }}
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
