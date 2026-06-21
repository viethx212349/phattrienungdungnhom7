import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DataTable from "../components/DataTable";
import FloatingButton from "../components/FloatingButton";
import AboutPage from "./AboutPage";

import CreateTaskModal from "../features/tasks/components/CreateTaskModal";
import KanbanBoard from "../features/tasks/components/KanbanBoard";
import type { Task } from "../types/task";
import { api } from "../lib/api";

const Dashboard = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.includes("/about") ? "about" : location.pathname.includes("/interns") ? "list" : "overview";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const fetchTasks = async () => {
    try {
      const res = await api.getTasks();
      const mappedTasks: Task[] = res.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description || "",
        assigneeId: t.intern_id || undefined,
        assigneeName: t.intern_name || undefined,
        dueDate: t.due_date || undefined,
        rawStatus: t.status,
        displayStatus: t.display_status,
        rejectedCount: t.rejected_count,
        attachments: [], // We can fetch attachments later if needed
        createdAt: t.created_at,
        closedAt: t.closed_at,
        submittedAt: t.submitted_at,
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // handleStatusChange has been removed.

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      if (updates.assigneeId && !tasks.find(t => t.id === taskId)?.assigneeId) {
         await api.assignTask(taskId, { intern_id: updates.assigneeId, due_date: updates.dueDate });
      } else {
         await api.updateTask(taskId, {
           title: updates.title,
           description: updates.description,
           due_date: updates.dueDate,
           attachments: updates.attachments,
         });
      }
      fetchTasks();
    } catch (err) {
      console.error("Task update failed:", err);
      alert(err instanceof Error ? err.message : "Cập nhật task thất bại");
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      console.error("Task delete failed:", err);
      alert(err instanceof Error ? err.message : "Xóa task thất bại");
      fetchTasks();
    }
  };

  const handleApproveTask = async (taskId: string, feedback: string) => {
    try {
      await api.approveTask(taskId, { mentor_feedback: feedback });
      fetchTasks();
    } catch (err) {
      console.error("Approve task failed:", err);
      alert(err instanceof Error ? err.message : "Duyệt task thất bại");
    }
  };

  const handleRejectTask = async (taskId: string, feedback: string) => {
    try {
      await api.rejectTask(taskId, { mentor_feedback: feedback });
      fetchTasks();
    } catch (err) {
      console.error("Reject task failed:", err);
      alert(err instanceof Error ? err.message : "Yêu cầu làm lại thất bại");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-blue-950 text-slate-100" : "bg-[#f5f5f5] text-black"
    }`}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => navigate(tab === "overview" ? "/dashboard" : tab === "list" ? "/interns" : "/about")}
        theme={theme}
        onThemeToggle={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
      />

      <Header theme={theme} />

      <main className="ml-[260px] pt-[80px]">
        <div className="p-8">
          {activeTab === "about" ? (
            <AboutPage theme={theme} />
          ) : activeTab === "overview" ? (
            <section>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-black">Tiến độ công việc</h1>
                  <p className="mt-1 text-sm text-gray-500">Quản lý các nhiệm vụ và thực tập sinh trong hệ thống</p>
                </div>
                <button
                  onClick={() => setIsOpenModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <span className="text-lg leading-none">+</span>
                  Tạo Task
                </button>
              </div>
              <KanbanBoard
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onApproveTask={handleApproveTask}
                onRejectTask={handleRejectTask}
              />
            </section>
          ) : (
            <section>
              <div className="mb-6">
                <h1 className="text-3xl font-black">Danh sách Thực tập sinh</h1>
                <p className="mt-1 text-sm text-gray-500">Quản lý thông tin và trạng thái thực tập sinh</p>
              </div>
              <DataTable page={1} limit={5} />
            </section>
          )}
        </div>
      </main>

       <FloatingButton onClick={() => setIsOpenModal(true)} /> 

      <CreateTaskModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onCreateTask={() => fetchTasks()}
      />
    </div>
  );
};

export default Dashboard;