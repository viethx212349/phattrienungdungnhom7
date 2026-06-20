import { Grid, Settings, Users, UserCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  userName: string;
}

const menuItems = [
  { id: 'overview', label: 'Tổng quan', icon: Grid, to: '/' },
  { id: 'interns', label: 'Danh sách TTS', icon: Users, to: '/interns' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, to: '/settings' },
] as const;

export default function Sidebar({ userName }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-20 flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-8">
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Architect Admin</span>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Intern Management</h1>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UserCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{userName}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Mentor / Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
