import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import apiClient from '../lib/apiClient';

interface InternDetailModalProps {
  internId: string;
  onClose: () => void;
  onSaved?: () => void;
}

interface TaskHistoryItem {
  name: string;
  deadline: string | null;
  raw_status: string;
  display_status: string;
  rejected_count: number;
  latest_feedback: string | null;
  submitted_at: string | null;
  closed_at: string | null;
}

interface InternDetailResponse {
  id: string;
  full_name: string;
  intern_code: string;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  school?: string | null;
  status: 'ACTIVE' | 'PASSED' | 'FAILED';
  final_feedback?: string | null;
  total_tasks: number;
  completed_count: number;
  overdue_count: number;
  total_revisions: number;
  task_history: TaskHistoryItem[];
  cv_link?: string | null;
}

export default function InternDetailModal({ internId, onClose, onSaved }: InternDetailModalProps) {
  const [data, setData] = useState<InternDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFinalize, setShowFinalize] = useState(false);


// lấy id của thực tập sinh 
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    apiClient
      .get(`/interns/${internId}`)
      .then((res) => {
        if (!mounted) return;
        setData(res.data.data ?? null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || err.message || 'Lỗi khi tải chi tiết intern');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [internId]);


// Chức năng của cái này là mở CV của thực tập sinh nên 
  const handleDownloadCV = () => {
    if (!data?.cv_link) return;
    window.open(data.cv_link, '_blank');
  };



  const canFinalize = data?.status === 'ACTIVE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl overflow-auto rounded-[32px] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">THÔNG TIN THỰC TẬP SINH</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{data?.full_name ?? '...'}</h2>
            <p className="mt-1 text-sm text-slate-600">{data?.position ?? 'Chưa cập nhật'}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-3 text-slate-700 transition hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-4 w-1/2 rounded-full bg-slate-200"></div>
            <div className="h-4 w-3/4 rounded-full bg-slate-200"></div>
            <div className="h-40 rounded-3xl bg-slate-100"></div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</div>
            ) : null}
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100" />
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium text-slate-900">{data?.email ?? 'Chưa có'}</p>
                <p className="mt-2 text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{data?.phone ?? 'Chưa có'}</p>
                <p className="mt-2 text-sm text-slate-500">Trường</p>
                <p className="font-medium text-slate-900">{data?.school ?? 'Chưa có'}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-slate-500">Trạng thái</p>
                <div className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${data?.status === 'ACTIVE' ? 'bg-slate-100 text-slate-700' : data?.status === 'PASSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {data?.status === 'ACTIVE' ? 'Đang thực tập' : data?.status === 'PASSED' ? 'Đã đạt' : 'Không đạt'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">TỔNG TASK</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{data?.total_tasks ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">HOÀN THÀNH</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{data?.completed_count ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">TRỄ HẠN</p>
                <p className="mt-2 text-2xl font-semibold text-rose-700">{data?.overdue_count ?? 0}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">LỊCH SỬ CÔNG VIỆC</p>
              <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                {data?.task_history?.length === 0 ? (
                  <p className="text-sm text-slate-500">Không có lịch sử công việc.</p>
                ) : (
                  data!.task_history.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-900">{t.name}</p>
                        <p className="text-sm text-slate-500">{t.deadline ? new Date(t.deadline).toLocaleDateString('vi-VN') : ''}</p>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${t.display_status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : t.display_status === 'OVERDUE' ? 'bg-rose-100 text-rose-700' : t.display_status === 'WAITING_REVIEW' ? 'bg-violet-100 text-violet-700' : t.display_status === 'NEEDS_REVISION' ? 'bg-orange-100 text-orange-700' : 'bg-sky-100 text-sky-700'}`}>
                          {t.display_status === 'COMPLETED' ? 'HOÀN THÀNH' : t.display_status === 'OVERDUE' ? 'TRỄ HẠN' : t.display_status === 'WAITING_REVIEW' ? 'CHỜ DUYỆT' : t.display_status === 'NEEDS_REVISION' ? 'CẦN SỬA' : 'ĐANG LÀM'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleDownloadCV}
                disabled={!data?.cv_link}
                className={`rounded-2xl inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${!data?.cv_link ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <Download size={16} /> TẢI CV
              </button>

              <button
                onClick={() => setShowFinalize(true)}
                disabled={!canFinalize}
                className={`ml-auto rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 ${!canFinalize ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                TIẾN HÀNH ĐÁNH GIÁ
              </button>
            </div>
          </div>
        )}
      </div>

      {showFinalize && data && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-[24px] bg-white p-6">
            <h3 className="text-lg font-semibold">Đánh giá tổng kết</h3>
            <p className="text-sm text-slate-500">Chốt kết quả cho {data.full_name}</p>
            <div className="mt-4 space-y-3">
              <select id="result" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <option value="PASSED">PASSED</option>
                <option value="FAILED">FAILED</option>
              </select>
              <textarea id="feedback" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" rows={4} placeholder="Nhập nhận xét..." />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowFinalize(false)} className="rounded-2xl border border-slate-300 bg-white px-4 py-2">Hủy</button>
              <button
                onClick={async () => {
                  const sel = document.getElementById('result') as HTMLSelectElement | null;
                  const fb = document.getElementById('feedback') as HTMLTextAreaElement | null;
                  const status = sel?.value ?? 'PASSED';
                  const final_feedback = fb?.value ?? null;
                  try {
                    await apiClient.put(`/interns/${internId}/finalize`, { status, final_feedback });
                    setShowFinalize(false);
                    onSaved?.();
                    onClose();
                  } catch (err) {
                    // ignore for now
                    alert('Không thể lưu đánh giá');
                  }
                }}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-white"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
