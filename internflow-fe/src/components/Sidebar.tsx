import { LayoutDashboard, Moon, Sun, Users } from "lucide-react";

type SidebarTab = "overview" | "list";

type ThemeMode = "light" | "dark";

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

const Sidebar = ({
  activeTab,
  onTabChange,
  theme,
  onThemeToggle,
}: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r px-4 py-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-blue-950 text-slate-100 border-blue-900"
          : "bg-[#eef0f3] text-black border-slate-200"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white text-xs font-bold">
            A
          </div>
          <div>
            <h1
              className={`text-sm font-black tracking-wide ${theme === "dark" ? "text-white" : "text-black"}`}
            >
              ARCHITECT ADMIN
            </h1>
            <p
              className={`text-[10px] tracking-[0.2em] ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}
            >
              MENTOR PORTAL
            </p>
          </div>
        </div>
      </div>
      
{/* Navigation  là thanh điều hướng điều chỉnh giữa các tab*/}
      <nav className="mt-8 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onTabChange("overview")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            activeTab === "overview"
              ? theme === "dark"
                ? "bg-blue-900 font-semibold text-white shadow-sm"
                : "bg-white font-semibold text-black shadow-sm"
              : theme === "dark"
                ? "text-slate-300 hover:bg-blue-900"
                : "text-gray-600 hover:bg-white"
          }`}
        >
          <LayoutDashboard size={18} />{" "}
          {/*LayoutDashboard là cái hộp bên chữ tổng quan */}
          Tổng quan
        </button>

        <button
          type="button"
          onClick={() => onTabChange("list")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            activeTab === "list"
              ? theme === "dark"
                ? "bg-blue-900 font-semibold text-white shadow-sm"
                : "bg-white font-semibold text-black shadow-sm"
              : theme === "dark"
                ? "text-slate-300 hover:bg-blue-900"
                : "text-gray-600 hover:bg-white"
          }`}
        >
          <Users size={18} />
          {/*Users là cái hộp bên chữ danh sách */}
          Danh sách TTS
        </button>


        <button
          type="button"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
            theme === "dark"
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-600 hover:bg-white"
          }`}
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </button>
      </nav>



      <div
        className={`mt-auto flex items-center gap-3 rounded-2xl p-3 transition-colors duration-300 ${
          theme === "dark" ? "bg-blue-900" : "bg-white shadow-sm"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-bold flex-shrink-0">
          EA
        </div>

        <div className="min-w-0">
          <p
            className={`text-sm font-semibold truncate ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Enterprise Admin
          </p>
          <p
            className={`text-[10px] tracking-[0.15em] truncate ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}
          >
            MASTER CONTROL
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
