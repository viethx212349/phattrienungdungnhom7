import React , { useState } from 'react';
import './ReviewModal.css';

export default function ReviewModal() {

  const [comment, setComment] = useState('');

  const task = {
    title: 'Thiết kế API Login',
    assignee: 'Hoàng Xuân Việt',
    submittedAt: '24/10/2026',
    submissionLink: 'https://google.com',
    status: 'IN_REVIEW',
  };

  const handleApprove = () => {
    alert('Duyệt task thành công');
  };

  const handleReject = () => {
    if (comment.trim() === '') {
      alert('Vui lòng nhập nhận xét');
      return;
    }
    alert('Đã yêu cầu làm lại');
  };

  return (

    <div className="overlay">

      {/* MODAL */}

      <div className="modal">

        {/* HEADER */}

        <div className="modal-header">

          <h1 className="modal-title">
            Nghiệm thu công việc
          </h1>

          <button className="close-button">
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="modal-body">

          {/* CARD */}

          <div className="task-card">

            {/* TITLE */}

            <div>

              <p className="label">
                TÊN CÔNG VIỆC
              </p>

              <h2 className="task-title">
                {task.title}
              </h2>
            </div>

            {/* USER + DATE */}

            <div className="info-row">

              {/* USER */}

              <div>

                <p className="label">
                  NGƯỜI THỰC HIỆN
                </p>

                <div className="info-item">

                  <span className="icon">
                    👤
                  </span>

                  <span className="info-text">
                    {task.assignee}
                  </span>
                </div>
              </div>

              {/* DATE */}

              <div>

                <p className="label">
                  NGÀY NỘP
                </p>

                <div className="info-item">

                  <span className="icon">
                    📅
                  </span>

                  <span className="info-text">
                    {task.submittedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* LINK */}

            <div className="attachment-section">

              <p className="label">
                TÀI LIỆU ĐÍNH KÈM
              </p>

              <a
                href={task.submissionLink}
                target="_blank"
                className="attachment-link"
              >
                <span>🔗</span>

                <span>
                  Link báo cáo đính kèm
                </span>
              </a>
            </div>
          </div>

          {/* COMMENT */}

          <div className="comment-section">

            <p className="comment-label">

              NHẬN XÉT TỪ MENTOR

              <span className="required">
                *
              </span>
            </p>

            <textarea

              value={comment}

              onChange={(e) =>
                setComment(e.target.value)
              }

              placeholder="Nhập nhận xét hoặc lý do yêu cầu làm lại..."

              className="comment-textarea"
            />
          </div>
        </div>

        {/* FOOTER */}

        {task.status === 'IN_REVIEW' && (

          <div className="modal-footer">
            {/* REJECT */}
            <button
              onClick={handleReject}
              className="reject-button"
            >
              YÊU CẦU LÀM LẠI
            </button>

            {/* APPROVE */}

            <button

              onClick={handleApprove}

              className="approve-button"
            >
              DUYỆT TASK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}