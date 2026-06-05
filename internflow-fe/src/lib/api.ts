const API_BASE = "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "API Error");
  }
  return json.data as T;
}

export const api = {
  // ── Tasks ──
  getTasks: () => request<any[]>("/tasks"),
  getTasksKanban: () => request<any>("/tasks/kanban"),
  getTaskById: (id: string) => request<any>(`/tasks/${id}`),
  getReviewTasks: () => request<any[]>("/tasks/review"),

  createTask: (data: {
    title: string;
    description?: string;
    intern_id?: string;
    due_date?: string;
    attachments?: { file_name: string; file_url: string; file_size?: number; type?: string }[];
  }) =>
    request<any>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || "Upload Error");
    }
    return json.data as { url: string; name: string; size: number; type: string };
  },

  updateTask: (
    id: string,
    data: {
      title?: string;
      description?: string;
      due_date?: string;
      mentor_feedback?: string;
    }
  ) =>
    request<any>(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  assignTask: (id: string, data: { intern_id: string; due_date: string }) =>
    request<any>(`/tasks/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  approveTask: (id: string, data?: { mentor_feedback?: string }) =>
    request<any>(`/tasks/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify(data || {}),
    }),

  rejectTask: (id: string, data: { mentor_feedback: string }) =>
    request<any>(`/tasks/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) =>
    request<any>(`/tasks/${id}`, { method: "DELETE" }),

  // ── Interns ──
  getInterns: (status?: string) =>
    request<any[]>(status ? `/interns?status=${status}` : "/interns"),

  getInternById: (id: string) => request<any>(`/interns/${id}`),

  finalizeIntern: (
    id: string,
    data: { status: string; final_feedback?: string }
  ) =>
    request<any>(`/interns/${id}/finalize`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
