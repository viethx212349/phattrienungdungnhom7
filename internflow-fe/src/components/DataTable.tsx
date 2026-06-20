import Badge from './Badge';
import { Intern, InternStatusLabel } from '../types';

interface DataTableProps {
  data: Intern[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick?: (intern: Intern) => void;
}

const headerColumns = ['Họ tên / Mã', 'Vị trí', 'Email', 'Số điện thoại', 'Trạng thái'];

export default function DataTable({ data, isLoading, page, limit, total, onPageChange, onRowClick }: DataTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Danh sách thực tập sinh</p>
            <p className="mt-2 text-sm text-slate-600">Quản lý trạng thái, email và liên hệ của intern.</p>
          </div>
          <div className="text-sm text-slate-500">{total} intern trong hệ thống</div>
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-300px)] px-6 pb-6">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead className="bg-white">
            <tr>
              {headerColumns.map((column) => (
                <th key={column} className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: limit }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {Array.from({ length: headerColumns.length }).map((_, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-4">
                        <div className="h-4 w-full rounded-full bg-slate-200"></div>
                      </td>
                    ))}
                  </tr>
                ))
                : data.map((intern) => (
                  <tr
                    key={intern.id}
                    onClick={() => onRowClick?.(intern)}
                    className={`group ${onRowClick ? 'cursor-pointer' : ''} rounded-3xl border border-transparent bg-slate-50 transition hover:border-slate-300 hover:bg-slate-100`}
                  >
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-slate-900">{intern.full_name}</p>
                      <p className="mt-2 text-sm text-slate-500">{intern.intern_code}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant="info">{intern.position}</Badge>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-700">{intern.email}</td>
                    <td className="px-4 py-4 align-top text-slate-700">{intern.phone}</td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant={intern.status === 'PASSED' ? 'success' : intern.status === 'FAILED' ? 'danger' : 'default'}>
                        {InternStatusLabel[intern.status]}
                      </Badge>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Trang {page} trên {totalPages}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
}
