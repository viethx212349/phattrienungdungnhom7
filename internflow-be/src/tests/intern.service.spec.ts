import { describe, it, expect, vi, beforeEach } from 'vitest';
import { internService } from '../services/intern.service';
import { internRepository } from '../repositories/intern.repository';

// ====== MOCK REPOSITORIES ======
vi.mock('../repositories/intern.repository', () => ({
  internRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByIdWithTasks: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe('Intern Service (TC16 – TC20)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // TC16 - getAllInterns: Lấy danh sách thành công
  // ──────────────────────────────────────────────────────────
  it('TC16 - getAllInterns: Lấy danh sách thực tập sinh thành công', async () => {
    const mockInterns = [{ id: '1', full_name: 'Nguyen Van A' }, { id: '2', full_name: 'Tran Thi B' }] as any[];
    vi.mocked(internRepository.findAll).mockResolvedValue(mockInterns);

    const result = await internService.getAllInterns();

    expect(internRepository.findAll).toHaveBeenCalledOnce();
    expect(result).toHaveLength(2);
    expect(result[0].full_name).toBe('Nguyen Van A');
  });

  // ──────────────────────────────────────────────────────────
  // TC17 - getInternById: Lấy chi tiết thành công
  // ──────────────────────────────────────────────────────────
  it('TC17 - getInternById: Lấy chi tiết thực tập sinh thành công khi thực tập sinh tồn tại', async () => {
    const mockInternDetail = {
      id: 'intern-1',
      full_name: 'Nguyen Van A',
      tasks: [
        { status: 'DONE', due_date: new Date('2025-01-01'), rejected_count: 0 },
        { status: 'IN_PROGRESS', due_date: new Date('2025-12-31'), rejected_count: 1 },
      ],
    } as any;
    vi.mocked(internRepository.findByIdWithTasks).mockResolvedValue(mockInternDetail);

    const result = await internService.getInternById('intern-1');

    expect(internRepository.findByIdWithTasks).toHaveBeenCalledWith('intern-1');
    expect(result.id).toBe('intern-1');
    expect(result.full_name).toBe('Nguyen Van A');
    expect(result.total_tasks).toBe(2);
    expect(result.completed_count).toBe(1);
    expect(result.total_revisions).toBe(1);
  });

  // ──────────────────────────────────────────────────────────
  // TC18 - getInternById: Lỗi khi không tồn tại
  // ──────────────────────────────────────────────────────────
  it('TC18 - getInternById: Không cho lấy chi tiết thực tập sinh nếu thực tập sinh không tồn tại', async () => {
    vi.mocked(internRepository.findByIdWithTasks).mockResolvedValue(null);

    await expect(internService.getInternById('invalid-id')).rejects.toThrow('Không tìm thấy thực tập sinh');

    expect(internRepository.findByIdWithTasks).toHaveBeenCalledWith('invalid-id');
  });

  // ──────────────────────────────────────────────────────────
  // TC19 - finalizeIntern: Lỗi khi không tồn tại
  // ──────────────────────────────────────────────────────────
  it('TC19 - finalizeIntern: Không cho chốt kết quả nếu thực tập sinh không tồn tại', async () => {
    vi.mocked(internRepository.findById).mockResolvedValue(null);

    await expect(internService.finalizeIntern('invalid-id', { status: 'PASSED' })).rejects.toThrow('Không tìm thấy thực tập sinh');

    expect(internRepository.findById).toHaveBeenCalledWith('invalid-id');
  });

  // ──────────────────────────────────────────────────────────
  // TC20 - finalizeIntern: Chốt thành công
  // ──────────────────────────────────────────────────────────
  it('TC20 - finalizeIntern: Chốt kết quả thực tập thành công khi dữ liệu hợp lệ', async () => {
    vi.mocked(internRepository.findById).mockResolvedValue({ id: 'intern-1' } as any);
    
    const mockUpdatedIntern = { id: 'intern-1', status: 'PASSED', final_feedback: 'Tốt' } as any;
    vi.mocked(internRepository.updateStatus).mockResolvedValue(mockUpdatedIntern);

    const result = await internService.finalizeIntern('intern-1', { status: 'PASSED', final_feedback: 'Tốt' });

    expect(internRepository.updateStatus).toHaveBeenCalledWith('intern-1', {
      status: 'PASSED',
      final_feedback: 'Tốt',
    });
    expect(result.status).toBe('PASSED');
  });
});
