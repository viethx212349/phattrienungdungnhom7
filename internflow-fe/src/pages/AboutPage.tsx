import { Info, Code2, Users, Globe, Mail, BookOpen } from "lucide-react";

type ThemeMode = "light" | "dark";

interface AboutPageProps {
  theme: ThemeMode;
}

const teamMembers = [
  { name: "Nhóm 7 — Phát triển ứng dụng", role: "Development Team" },
];

const techStack = [
  { category: "Frontend", items: ["React 19", "TypeScript", "Vite", "Tailwind CSS v4"] },
  { category: "Desktop", items: ["Electron 36", "electron-builder (NSIS)"] },
  { category: "Backend", items: ["Node.js", "Express", "TypeScript"] },
  { category: "Database", items: ["PostgreSQL (Supabase)", "Prisma ORM"] },
];

const AboutPage = ({ theme }: AboutPageProps) => {
  const isDark = theme === "dark";

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* App Identity */}
      <div className="text-center mb-10">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 text-white text-2xl font-black shadow-lg ${
          isDark
            ? "bg-gradient-to-br from-blue-500 to-blue-700"
            : "bg-gradient-to-br from-slate-800 to-black"
        }`}>
          IF
        </div>
        <h1 className="text-3xl font-black tracking-tight">InternFlow</h1>
        <p className={`mt-2 text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          Hệ thống quản lý thực tập sinh — Mentor Desktop App
        </p>
        <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
          isDark ? "bg-blue-900/60 text-blue-300" : "bg-slate-100 text-slate-600"
        }`}>
          Phiên bản 1.0.0
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* About Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          isDark ? "bg-blue-900/40 border border-blue-800" : "bg-white shadow-sm border border-slate-100"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
              isDark ? "bg-blue-800 text-blue-300" : "bg-slate-100 text-slate-600"
            }`}>
              <Info size={18} />
            </div>
            <h2 className="text-base font-bold">Giới thiệu</h2>
          </div>
          <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            <strong>InternFlow</strong> là hệ thống quản lý thực tập sinh nội bộ (SaaS-like Internal HR Management),
            được thiết kế theo kiến trúc <strong>Client-Server</strong> với cấu trúc <strong>Monorepo</strong>.
          </p>
          <p className={`text-sm leading-relaxed mt-3 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            Ứng dụng Desktop dành cho Mentor để quản lý, giao việc, theo dõi tiến độ và đánh giá thực tập sinh.
          </p>
        </div>

        {/* Project Info Card */}
        <div className={`rounded-2xl p-6 transition-colors duration-300 ${
          isDark ? "bg-blue-900/40 border border-blue-800" : "bg-white shadow-sm border border-slate-100"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
              isDark ? "bg-blue-800 text-blue-300" : "bg-slate-100 text-slate-600"
            }`}>
              <BookOpen size={18} />
            </div>
            <h2 className="text-base font-bold">Thông tin dự án</h2>
          </div>
          <ul className={`text-sm space-y-2.5 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
            <li className="flex justify-between">
              <span>Môn học</span>
              <span className="font-medium">Phát triển ứng dụng</span>
            </li>
            <li className={`border-t ${isDark ? "border-blue-800" : "border-slate-100"}`}></li>
            <li className="flex justify-between">
              <span>Nhóm</span>
              <span className="font-medium">Nhóm 7</span>
            </li>
            <li className={`border-t ${isDark ? "border-blue-800" : "border-slate-100"}`}></li>
            <li className="flex justify-between">
              <span>Kiến trúc</span>
              <span className="font-medium">Client-Server (Monorepo)</span>
            </li>
            <li className={`border-t ${isDark ? "border-blue-800" : "border-slate-100"}`}></li>
            <li className="flex justify-between">
              <span>Nền tảng</span>
              <span className="font-medium">Windows Desktop (Electron)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Tech Stack */}
      <div className={`rounded-2xl p-6 mb-8 transition-colors duration-300 ${
        isDark ? "bg-blue-900/40 border border-blue-800" : "bg-white shadow-sm border border-slate-100"
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
            isDark ? "bg-blue-800 text-blue-300" : "bg-slate-100 text-slate-600"
          }`}>
            <Code2 size={18} />
          </div>
          <h2 className="text-base font-bold">Công nghệ sử dụng</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map((group) => (
            <div key={group.category}>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                isDark ? "text-blue-400" : "text-slate-400"
              }`}>
                {group.category}
              </h3>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`text-sm px-2.5 py-1.5 rounded-lg ${
                      isDark ? "bg-blue-800/50 text-slate-200" : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className={`rounded-2xl p-6 mb-8 transition-colors duration-300 ${
        isDark ? "bg-blue-900/40 border border-blue-800" : "bg-white shadow-sm border border-slate-100"
      }`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`flex items-center justify-center w-9 h-9 rounded-xl ${
            isDark ? "bg-blue-800 text-blue-300" : "bg-slate-100 text-slate-600"
          }`}>
            <Users size={18} />
          </div>
          <h2 className="text-base font-bold">Đội ngũ phát triển</h2>
        </div>
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className={`flex items-center gap-4 p-3 rounded-xl ${
              isDark ? "bg-blue-800/30" : "bg-slate-50"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white text-sm font-bold flex-shrink-0">
              N7
            </div>
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-400"}`}>{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          © 2025 InternFlow — Nhóm 7, Phát triển ứng dụng.
        </p>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-600" : "text-gray-300"}`}>
          Built with Electron + React + TypeScript
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
