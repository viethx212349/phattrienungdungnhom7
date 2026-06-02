export type RawTaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

export type DisplayTaskStatus =
  | "UNASSIGNED"
  | "IN_PROGRESS"
  | "NEEDS_REVISION"
  | "WAITING_REVIEW"
  | "COMPLETED"
  | "OVERDUE";

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  rawStatus: RawTaskStatus;
  displayStatus: DisplayTaskStatus;
  rejectedCount?: number;
  attachments?: string[];
}
