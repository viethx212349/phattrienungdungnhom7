// ============================================================
// Enums — mapping 1:1 với Prisma schema ở Backend
// ============================================================

export type InternStatus = 'ACTIVE' | 'PASSED' | 'FAILED';

export enum InternStatusLabel {
  ACTIVE = 'ĐANG THỰC TẬP',
  PASSED = 'ĐÃ PASS',
  FAILED = 'THẤT BẠI',
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export type TaskDisplayStatus =
  | 'UNASSIGNED'
  | 'IN_PROGRESS'
  | 'NEEDS_REVISION'
  | 'WAITING_REVIEW'
  | 'COMPLETED'
  | 'OVERDUE';

export type NotificationType = 'NEW_TASK' | 'REMINDER' | 'REJECTED';

export type AttachmentType = 'MENTOR_DOC' | 'INTERN_SUBMIT';

// ============================================================
// Models — mapping 1:1 với Prisma schema ở Backend
// ============================================================

export interface Intern {
  id: string;
  full_name: string;
  intern_code: string;
  position: string | null;
  email: string | null;
  phone: string | null;
  school: string | null;
  status: InternStatus;
  final_feedback: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  intern_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  display_status: TaskDisplayStatus;
  rejected_count: number;
  due_date: string | null;
  assigned_at: string | null;
  submitted_at: string | null;
  closed_at: string | null;
  mentor_feedback: string | null;
  submission_link: string | null;
  submission_summary: string | null;
  created_at: string;
  updated_at: string;
  intern_name?: string | null;
  // Relations (optional, chỉ có khi BE include)
  intern?: Intern;
  notifications?: Notification[];
  task_attachments?: TaskAttachment[];
}

export interface Notification {
  id: string;
  intern_id: string;
  task_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  // Relations
  intern?: Intern;
  task?: Task;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  type: AttachmentType;
  created_at: string;
  // Relations
  task?: Task;
}

// ============================================================
// User & Auth
// ============================================================

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'intern' | 'mentor';
}

// ============================================================
// API Response wrapper — chuẩn bị cho khi BE implement response format
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
