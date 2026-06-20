import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}


export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="fixed left-72 right-0 top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{subtitle}</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="search" className="relative block flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="search"
              placeholder="Tìm intern hoặc email..."
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
