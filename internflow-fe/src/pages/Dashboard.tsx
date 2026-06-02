import { useState } from "react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DataTable from "../components/DataTable";
import FloatingButton from "../components/FloatingButton";

import CreateTaskModal from "../features/tasks/components/CreateTaskModal";
import KanbanBoard from "../features/tasks/components/KanbanBoard";
import type { Task } from "../types/task";
import { mockTasks } from "../data/mockTasks";

const Dashboard = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "list">("overview");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" ? "bg-blue-950 text-slate-100" : "bg-[#f5f5f5] text-black"
    }`}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onThemeToggle={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
      />

      <Header theme={theme} />

      <main className="ml-[260px] pt-[100px]">
        <div className="p-10">
          {activeTab === "overview" ? (
            <section>
              <h1 className="mb-8 text-6xl font-black">Tiến độ công việc</h1>
              <KanbanBoard
                tasks={tasks}
                onStatusChange={(taskId, newStatus) => {
                  setTasks((currentTasks) =>
                    currentTasks.map((task) => {
                      if (task.id !== taskId) return task;

                      const isOverdue =
                        task.dueDate && new Date(task.dueDate) < new Date();

                      const newDisplayStatus: Task["displayStatus"] =
                        newStatus === "TODO"
                          ? task.assigneeId
                            ? "IN_PROGRESS"
                            : "UNASSIGNED"
                          : newStatus === "IN_PROGRESS"
                          ? isOverdue
                            ? "OVERDUE"
                            : "IN_PROGRESS"
                          : newStatus === "IN_REVIEW"
                          ? task.rejectedCount && task.rejectedCount > 0
                            ? "NEEDS_REVISION"
                            : "WAITING_REVIEW"
                          : "COMPLETED";

                      return {
                        ...task,
                        rawStatus: newStatus,
                        displayStatus: newDisplayStatus,
                      };
                    })
                  );
                }}
                onUpdateTask={(taskId, updates) => {
                  setTasks((currentTasks) =>
                    currentTasks.map((task) => {
                      if (task.id !== taskId) return task;

                            const dueDate = updates.dueDate ?? task.dueDate;
                      const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;

                      // If assigning to someone, move to IN_PROGRESS
                      const newRawStatus = updates.assigneeId && !task.assigneeId
                        ? "IN_PROGRESS"
                        : task.rawStatus;

                      const newDisplayStatus: Task["displayStatus"] =
                        updates.assigneeId && !task.assigneeId
                          ? isOverdue
                            ? "OVERDUE"
                            : "IN_PROGRESS"
                          : task.displayStatus;

                      return {
                        ...task,
                        assigneeName: updates.assigneeName ?? task.assigneeName,
                        assigneeId: updates.assigneeId ?? task.assigneeId,
                        dueDate: updates.dueDate ?? task.dueDate,
                        rawStatus: newRawStatus,
                        displayStatus: newDisplayStatus,
                        title: updates.title ?? task.title,
                        description: updates.description ?? task.description,
                        attachments: updates.attachments ?? task.attachments,
                      };
                    })
                  );
                }}
                onDeleteTask={(taskId) => {
                  setTasks((currentTasks) =>
                    currentTasks.filter((task) => task.id !== taskId),
                  );
                }}
              />
            </section>
          ) : (
            <section>
              <h1 className="mb-8 text-6xl font-black">Danh sách Thực tập sinh</h1>
              <DataTable page={1} limit={5} />
            </section>
          )}
        </div>
      </main>

       <FloatingButton
        onClick={() => setIsOpenModal(true)}
      /> 
       {/*Nút plus, hay dấu cộng  */}


      <CreateTaskModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onCreateTask={(task) => setTasks((current) => [task, ...current])}
      />
    </div>
  );
};

export default Dashboard;