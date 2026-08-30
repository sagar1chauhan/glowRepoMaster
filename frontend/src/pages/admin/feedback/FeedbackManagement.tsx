import React, { useState } from 'react';
import { MessageSquare, Star, Send } from 'lucide-react';

interface FeedbackItem {
  id: string;
  member_name: string;
  category: 'EQUIPMENT' | 'TRAINER' | 'CLEANLINESS' | 'CROWD' | 'GENERAL';
  rating: number;
  message: string;
  submitted_date: string;
  status: 'RESOLVED' | 'UNDER_REVIEW' | 'NEW';
  admin_reply?: string;
}

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-1',
    member_name: 'Rajesh Nair',
    category: 'CLEANLINESS',
    rating: 5,
    message: 'Shower rooms and locker cleanliness has significantly improved this week! Kudos to the maintenance team.',
    submitted_date: '2026-08-28',
    status: 'RESOLVED',
    admin_reply: 'Thank you Rajesh! We have added dedicated staff for hourly checks.',
  },
  {
    id: 'fb-2',
    member_name: 'Simran Kaur',
    category: 'EQUIPMENT',
    rating: 4,
    message: 'Can we add one more 15kg and 20kg dumbbell pair? Evening peak hours they are always occupied.',
    submitted_date: '2026-08-27',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'fb-3',
    member_name: 'Manish Pandey',
    category: 'TRAINER',
    rating: 5,
    message: 'Trainer Dev gave great form correction for squats and deadlifts today. Very patient coach.',
    submitted_date: '2026-08-26',
    status: 'RESOLVED',
    admin_reply: 'Appreciate the feedback Manish! Shared with Coach Dev.',
  },
];

export const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleResolve = (id: string) => {
    setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, status: 'RESOLVED' } : f)));
  };

  const handleSendReply = (id: string) => {
    if (!replyText[id]) return;
    setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, admin_reply: replyText[id], status: 'RESOLVED' } : f)));
    setReplyText({ ...replyText, [id]: '' });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          <MessageSquare size={24} style={{ color: 'var(--color-primary)' }} />
          Member Feedback & NPS Hub
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Listen to member suggestions, equipment requests, cleanliness ratings, and resolution tickets.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">Average Gym Rating</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>4.8 / 5.0</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-label">Total Submissions</div>
          <div className="stat-value">{feedbacks.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Pending Action</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {feedbacks.filter((f) => f.status !== 'RESOLVED').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Resolution Rate</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>94%</div>
        </div>
      </div>

      {/* Feedback List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {feedbacks.map((fb) => (
          <div key={fb.id} className="stat-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{fb.member_name}</h3>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--color-text-muted)' }}>
                    {fb.category}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  📅 Submitted on {fb.submitted_date}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '2px', color: 'var(--color-warning)' }}>
                  {[...Array(fb.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-warning)" />
                  ))}
                </div>
                <span className={`badge ${fb.status === 'RESOLVED' ? 'badge-active' : 'badge-pending'}`}>
                  {fb.status}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.5', marginBottom: '14px' }}>
              "{fb.message}"
            </p>

            {fb.admin_reply ? (
              <div style={{ background: 'rgba(0, 230, 118, 0.08)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-success)', fontSize: '13px' }}>
                <strong style={{ color: 'var(--color-success)' }}>Gym Response: </strong>
                {fb.admin_reply}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Type an official reply to member..."
                  value={replyText[fb.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [fb.id]: e.target.value })}
                  className="form-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '13px' }}
                />
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                  onClick={() => handleResolve(fb.id)}
                >
                  Quick Resolve
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => handleSendReply(fb.id)}
                >
                  <Send size={13} /> Reply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackManagement;
