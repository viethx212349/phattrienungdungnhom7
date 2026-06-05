// ============================================================
// [API Contract] Task Display Status — Utility helpers
// ============================================================
// Frontend chỉ dùng display_status do Backend trả về.
// Dùng các hàm này để map display_status → badge label và badge color.
//
// Mapping chuẩn:
//   UNASSIGNED     → 'Chưa gán'
//   IN_PROGRESS    → 'Đang làm'
//   NEEDS_REVISION → 'Cần sửa'
//   WAITING_REVIEW → 'Chờ duyệt'
//   COMPLETED      → 'Hoàn thành'
//   OVERDUE        → 'Trễ hạn'
// ============================================================

import type { TaskDisplayStatus } from '../types';

// Badge label tiếng Việt
export const DISPLAY_STATUS_LABEL: Record<TaskDisplayStatus, string> = {
  UNASSIGNED:     'Chưa gán',
  IN_PROGRESS:    'Đang làm',
  NEEDS_REVISION: 'Cần sửa',
  WAITING_REVIEW: 'Chờ duyệt',
  COMPLETED:      'Hoàn thành',
  OVERDUE:        'Trễ hạn',
};

// CSS class cho badge (dùng với class tương ứng trong CSS)
export const DISPLAY_STATUS_COLOR: Record<TaskDisplayStatus, string> = {
  UNASSIGNED:     'badge--gray',
  IN_PROGRESS:    'badge--blue',
  NEEDS_REVISION: 'badge--orange',
  WAITING_REVIEW: 'badge--purple',
  COMPLETED:      'badge--green',
  OVERDUE:        'badge--red',
};

/**
 * Trả về label tiếng Việt từ display_status
 * @example getStatusLabel('NEEDS_REVISION') → 'Cần sửa'
 */
export const getStatusLabel = (status: TaskDisplayStatus): string =>
  DISPLAY_STATUS_LABEL[status];

/**
 * Trả về CSS class badge từ display_status
 * @example getStatusColor('OVERDUE') → 'badge--red'
 */
export const getStatusColor = (status: TaskDisplayStatus): string =>
  DISPLAY_STATUS_COLOR[status];
