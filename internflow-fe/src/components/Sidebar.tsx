import { LayoutDashboard, Moon, Settings, Sun, Users } from "lucide-react";

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
        <h1
          className={`text-3xl font-black ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          ARCHITECT ADMIN
        </h1>
        <p
          className={`mt-2 text-sm tracking-[0.3em] ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
        >
          MENTOR PORTAL
        </p>
      </div>
      
{/* Navigation  là thanh điều hướng điều chỉnh giữa các tab*/}
      <nav className="mt-16 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onTabChange("overview")}
          className={`flex items-center gap-3 rounded-xl px-4 py-4 transition ${
            activeTab === "overview"
              ? theme === "dark"
                ? "bg-blue-900 font-semibold text-white shadow-sm"
                : "bg-white font-semibold text-black shadow-sm"
              : theme === "dark"
                ? "text-slate-300 hover:bg-blue-900"
                : "text-gray-600 hover:bg-white"
          }`}
        >
          <LayoutDashboard size={20} />{" "}
          {/*LayoutDashboard là cái hộp bên chữ tổng quan */}
          Tổng quan
        </button>

        <button
          type="button"
          onClick={() => onTabChange("list")}
          className={`flex items-center gap-3 rounded-xl px-4 py-4 transition ${
            activeTab === "list"
              ? theme === "dark"
                ? "bg-blue-900 font-semibold text-white shadow-sm"
                : "bg-white font-semibold text-black shadow-sm"
              : theme === "dark"
                ? "text-slate-300 hover:bg-blue-900"
                : "text-gray-600 hover:bg-white"
          }`}
        >
          <Users size={20} />
          {/*Users là cái hộp bên chữ danh sách */}
          Danh sách TTS
        </button>

        <button
          type="button"
          className={`flex items-center gap-3 rounded-xl px-4 py-4 transition ${
            theme === "dark"
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-600 hover:bg-white"
          }`}
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
        </button>

        <button className="flex items-center gap-3 rounded-xl px-4 py-4 text-gray-600 transition hover:bg-white">
          <Settings size={20} />
          Cài đặt
        </button>
      </nav>



      <div
        className={`mt-auto flex items-center gap-3 rounded-2xl p-4 shadow-sm transition-colors duration-300 ${
          theme === "dark" ? "bg-blue-900" : "bg-white"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold">
          AH
        </div>

        <div>
          <p
            className={`font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}
          >
            Âu Hùng
          </p>
          <p
            className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
          >
            Admin
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
