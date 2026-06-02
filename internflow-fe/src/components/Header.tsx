import { Bell, CircleUserRound } from "lucide-react";
//Bell = icon chuông thông báo, CircleUserRound = icon người dùng tròn
type ThemeMode = "light" | "dark";

interface HeaderProps {
  theme: ThemeMode;
}

const Header = ({ theme }: HeaderProps) => {
  return (
    <header
      className={`fixed left-[260px] right-0 top-0 z-10 flex h-[80px] items-center justify-between border-b px-10 transition-colors duration-300 ${
        theme === "dark"
          ? "border-blue-900 bg-blue-950 text-slate-100"
          : "border-slate-200 bg-[#f5f5f5] text-black"
      }`}
    >
      <h2 className="text-2xl font-bold">Intern Management</h2>
      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />
        <CircleUserRound className="cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
