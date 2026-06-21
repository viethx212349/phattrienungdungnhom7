import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  BellOff,
  FileText,
  AlertTriangle,
  Clock,
  CheckCheck,
} from "lucide-react";
import { api } from "../lib/api";
import type { Notification, NotificationType } from "../types";

// ── Helpers ──────────────────────────────────────────────────

const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Hôm qua";
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const typeConfig: Record<
  NotificationType,
  { icon: typeof FileText; color: string; bg: string; darkBg: string }
> = {
  NEW_TASK: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    darkBg: "bg-blue-900/30",
  },
  REJECTED: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50",
    darkBg: "bg-red-900/30",
  },
  REMINDER: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
    darkBg: "bg-amber-900/30",
  },
};

// ── Props ────────────────────────────────────────────────────

interface NotificationDropdownProps {
  theme: "light" | "dark";
}

// ── Component ────────────────────────────────────────────────

const NotificationDropdown = ({ theme }: NotificationDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  // ── Fetch data ──

  const fetchNotifications = useCallback(async () => {
    try {
      const [list, countData] = await Promise.all([
        api.getNotifications(),
        api.getUnreadCount(),
      ]);
      setNotifications(list as Notification[]);
      setUnreadCount(
        typeof countData === "number"
          ? countData
          : (countData as any)?.count ?? 0
      );
    } catch {
      // Silently ignore – the dropdown still works with stale data
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Click outside ──

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Actions ──

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative cursor-pointer rounded-xl p-2 transition-colors duration-200 ${
          isDark ? "hover:bg-blue-900/60" : "hover:bg-slate-200"
        }`}
        aria-label="Thông báo"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute right-0 top-[calc(100%+8px)] z-50 w-[380px] origin-top-right overflow-hidden rounded-2xl border shadow-xl transition-all duration-200 ${
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        } ${
          isDark
            ? "border-blue-900 bg-blue-950 text-slate-100"
            : "border-slate-200 bg-white text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-5 py-4 ${
            isDark ? "border-blue-900" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[11px] font-semibold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
                isDark
                  ? "text-blue-400 hover:bg-blue-900/60"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[400px] overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <BellOff
                className={`h-10 w-10 ${
                  isDark ? "text-slate-600" : "text-slate-300"
                }`}
              />
              <p
                className={`text-sm ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Không có thông báo nào
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const cfg = typeConfig[n.type] ?? typeConfig.NEW_TASK;
              const Icon = cfg.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkAsRead(n.id)}
                  className={`flex w-full cursor-pointer items-start gap-3.5 border-b px-5 py-3.5 text-left transition-colors duration-150 last:border-b-0 ${
                    isDark
                      ? `border-blue-900/60 ${
                          n.is_read
                            ? "hover:bg-blue-900/30"
                            : "bg-blue-900/20 hover:bg-blue-900/40"
                        }`
                      : `border-slate-100 ${
                          n.is_read
                            ? "hover:bg-slate-50"
                            : "bg-blue-50/50 hover:bg-blue-50"
                        }`
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      isDark ? cfg.darkBg : cfg.bg
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${cfg.color}`} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-snug ${
                          n.is_read ? "font-normal" : "font-semibold"
                        }`}
                      >
                        {n.title}
                      </p>
                      {/* Unread dot */}
                      {!n.is_read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p
                      className={`mt-0.5 line-clamp-2 text-xs leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {formatRelativeTime(n.created_at)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
