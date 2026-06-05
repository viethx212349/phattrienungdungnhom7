import { useState } from "react";
import type { Task } from "../../../types/task";
import { mockInterns } from "../../../data/mockInterns";

interface UpdateTaskProps {
  task: Task;
  onSave: (updates: { assigneeName?: string; assigneeId?: string; dueDate?: string }) => void;
  onCancel: () => void;
}

const UpdateTask = ({ task, onSave, onCancel }: UpdateTaskProps) => {
  const [editForm, setEditForm] = useState({
    assigneeId: task.assigneeId || "",
    assigneeName: task.assigneeName || "",
    dueDate: task.dueDate || "",
  });

  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");

    // Check if due date is in the past
    if (editForm.dueDate) {
      const selectedDate = new Date(editForm.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("Hạn chót không được là ngày trong quá khứ");
        return;
      }
    }

    onSave({
      assigneeId: editForm.assigneeId || undefined,
      assigneeName: editForm.assigneeName || undefined,
      dueDate: editForm.dueDate || undefined,
    });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedIntern = mockInterns.find((intern) => intern.id === selectedId);
    setEditForm({
      ...editForm,
      assigneeId: selectedId,
      assigneeName: selectedIntern?.fullName || "",
    });
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm uppercase tracking-[0.35em] text-gray-500">
          Người nhận
        </label>
        <select
          value={editForm.assigneeId}
          onChange={handleAssigneeChange}
          className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">-- Chọn người nhận --</option>
          {mockInterns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.fullName} ({intern.position})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm uppercase tracking-[0.35em] text-gray-500">
          Hạn chót
        </label>
        <input
          type="date"
          value={editForm.dueDate}
          min={today}
          onChange={(e) => {
            setEditForm({
              ...editForm,
              dueDate: e.target.value,
            });
            setError("");
          }}
          className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 rounded-2xl bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600"
        >
          Lưu
        </button>
        <button
          onClick={onCancel}
          className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-400"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

export default UpdateTask;
