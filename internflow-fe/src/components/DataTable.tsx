import { useState } from "react";
import { Mail, Phone, GraduationCap } from "lucide-react";
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

  const openInternModal = (intern: Intern) => setSelectedIntern(intern);
  const closeInternModal = () => setSelectedIntern(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const openReviewModal = () => setIsReviewOpen(true);
  const closeReviewModal = () => setIsReviewOpen(false);

  const internDetailsData = selectedIntern ? getInternDetails(selectedIntern.id) : null;
  const taskStats = internDetailsData?.taskStats || [];
  const workHistory = internDetailsData?.workHistory || [];


  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b text-left text-sm uppercase tracking-wide text-gray-500">
              <th className="px-8 py-6">Họ tên & Mã số</th>
              <th className="px-8 py-6">Vị trí</th>
              <th className="px-8 py-6">Email</th>
              <th className="px-8 py-6">Số điện thoại</th>
              <th className="px-8 py-6">Trạng thái</th>
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
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 font-bold">
                        {intern.fullName
                          .split(" ")
                          .map((word) => word[0])
                          .slice(-2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-bold">{intern.fullName}</p>
                        <p className="text-sm text-gray-500">{intern.code}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    <Badge label={intern.position} />
                  </td>

                  <td className="px-8 py-6 text-gray-700">{intern.email}</td>

                  <td className="px-8 py-6 text-gray-700">{intern.phone}</td>

                  <td className="px-8 py-6">
                    <Badge
                      label={intern.status}
                      variant={
                        intern.status === InternStatus.INTERNING
                          ? "success"
                          : "default"
                      }
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={Boolean(selectedIntern)} onClose={closeInternModal}>
        {selectedIntern && (
          <div className="p-6 sm:p-8">
            <div className="mb-8 flex flex-col gap-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-[30px] bg-slate-900 text-3xl font-black text-white">
                  {selectedIntern.fullName
                    .split(" ")
                    .map((word) => word[0])
                    .slice(-2)
                    .join("")}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Thông tin thực tập sinh</p>
                  <h2 className="mt-2 text-3xl font-bold text-slate-950">{selectedIntern.fullName}</h2>
                  <p className="mt-2 text-lg font-semibold text-slate-600">{selectedIntern.position}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  label={selectedIntern.status}
                  variant={selectedIntern.status === InternStatus.INTERNING ? "success" : "default"}
                />
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  <GraduationCap size={16} /> HUST
                </div>
              </div>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-4 rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {taskStats.map((item) => (
                    <div key={item.label} className="rounded-[24px] bg-white p-5 shadow-sm">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-3xl font-bold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail size={18} />
                    <span>{selectedIntern.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700">
                    <Phone size={18} />
                    <span>{selectedIntern.phone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-xl font-semibold text-slate-900">Lịch sử công việc</h3>
                <div className="space-y-4">
                  {workHistory.map((history) => (
                    <div key={history.title} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{history.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{history.date}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          history.status === "HOÀN THÀNH"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {history.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeInternModal}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                className="rounded-full border border-slate-300 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Tải CV
              </button>
              <button
                className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
                onClick={(event) => {
                  event.stopPropagation();
                  openReviewModal();
                }}
              >
                Tiến hành đánh giá
              </button>
            </div>
          </div>
        )}
      </Modal>

      <InternEvaluationModal
        isOpen={isReviewOpen}
        onClose={closeReviewModal}
        intern={selectedIntern}
      />

      <div className="flex items-center justify-end gap-3 p-6">
        <button className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200">
          ←
        </button>

        <button className="rounded-lg bg-black px-4 py-2 text-white">1</button>

        <button className="rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200">
          →
        </button>
      </div>
    </div>
  );
};

export default DataTable;
