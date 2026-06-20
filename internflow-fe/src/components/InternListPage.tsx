import { useState } from 'react';
import { Plus } from 'lucide-react'; // icon plus đã xóa không cần thiết
import Header from './Header';
import DataTable from './DataTable';
import useInternList from '../hooks/useInternList';
import InternDetailModal from './InternDetailModal';

export default function InternListPage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, isLoading, total } = useInternList({ page, limit, refreshKey });
  const [selectedInternId, setSelectedInternId] = useState<string | null>(null);
// một là string 2 là null



  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header title="Danh sách Thực tập sinh" subtitle="Admin/Mentor dashboard" />
      <main className="px-6 pb-10 pt-40">
        <DataTable
          data={data}
          isLoading={isLoading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
          onRowClick={(intern) => setSelectedInternId(intern.id)}
        />
      </main>
      {selectedInternId && (
        <InternDetailModal
          internId={selectedInternId}
          onClose={() => setSelectedInternId(null)}
          onSaved={() => setRefreshKey((v) => v + 1)}
        />
      )}
    </div>
  );
}
