import React, { useState } from 'react';
import { Dumbbell, Plus, Search, Eye, Edit3 } from 'lucide-react';

interface WorkoutRoutine {
  id: string;
  member_name: string;
  plan_name: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  target_goal: string;
  schedule_days: {
    day: string;
    focus: string;
    exercises_count: number;
  }[];
  assigned_by: string;
  updated_at: string;
}

const INITIAL_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'wc-1',
    member_name: 'Rahul Sharma',
    plan_name: 'Hypertrophy 4-Day Split',
    level: 'INTERMEDIATE',
    target_goal: 'Muscle Building & Strength',
    assigned_by: 'Trainer Dev',
    updated_at: '2026-08-25',
    schedule_days: [
      { day: 'Monday', focus: 'Chest & Triceps', exercises_count: 6 },
      { day: 'Tuesday', focus: 'Back & Biceps', exercises_count: 6 },
      { day: 'Thursday', focus: 'Shoulders & Traps', exercises_count: 5 },
      { day: 'Friday', focus: 'Legs & Core', exercises_count: 6 },
    ],
  },
  {
    id: 'wc-2',
    member_name: 'Sneha Joshi',
    plan_name: 'Weight Loss & Conditioning',
    level: 'BEGINNER',
    target_goal: 'Fat Loss & Stamina',
    assigned_by: 'Trainer Pooja',
    updated_at: '2026-08-27',
    schedule_days: [
      { day: 'Monday', focus: 'Full Body HIIT', exercises_count: 8 },
      { day: 'Wednesday', focus: 'Lower Body & Glutes', exercises_count: 6 },
      { day: 'Friday', focus: 'Upper Body & Cardio', exercises_count: 7 },
      { day: 'Saturday', focus: 'Core & Mobility', exercises_count: 5 },
    ],
  },
  {
    id: 'wc-3',
    member_name: 'Vikram Singh',
    plan_name: 'Powerlifting Foundation',
    level: 'ADVANCED',
    target_goal: 'Squat, Bench & Deadlift PRs',
    assigned_by: 'Head Coach Sameer',
    updated_at: '2026-08-20',
    schedule_days: [
      { day: 'Monday', focus: 'Heavy Squat + Acc', exercises_count: 5 },
      { day: 'Wednesday', focus: 'Heavy Bench + Triceps', exercises_count: 5 },
      { day: 'Friday', focus: 'Heavy Deadlift + Upper Back', exercises_count: 4 },
    ],
  },
];

export const WorkoutCards: React.FC = () => {
  const [routines] = useState<WorkoutRoutine[]>(INITIAL_ROUTINES);
  const [search, setSearch] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);

  const filtered = routines.filter(
    (r) =>
      r.member_name.toLowerCase().includes(search.toLowerCase()) ||
      r.plan_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Dumbbell size={24} style={{ color: 'var(--color-accent)' }} />
            Member Workout Cards & Routines
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Design personalized training schedules, assign workout splits, and track member exercise cards.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('New Workout Card builder')}>
          <Plus size={16} /> Assign New Routine
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by member or plan name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Routines Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((r) => (
          <div key={r.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(108, 92, 231, 0.2)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    {r.member_name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{r.member_name}</h3>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Assigned by {r.assigned_by}</div>
                  </div>
                </div>

                <span
                  className="badge"
                  style={{
                    background:
                      r.level === 'BEGINNER'
                        ? 'rgba(0, 230, 118, 0.15)'
                        : r.level === 'INTERMEDIATE'
                        ? 'rgba(0, 210, 255, 0.15)'
                        : 'rgba(255, 171, 64, 0.15)',
                    color:
                      r.level === 'BEGINNER'
                        ? 'var(--color-success)'
                        : r.level === 'INTERMEDIATE'
                        ? 'var(--color-accent)'
                        : 'var(--color-warning)',
                  }}
                >
                  {r.level}
                </span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-accent)' }}>{r.plan_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>🎯 Goal: {r.target_goal}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {r.schedule_days.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{day.day}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{day.focus}</span>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                      {day.exercises_count} ex
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                onClick={() => setSelectedRoutine(r)}
              >
                <Eye size={13} /> View Card
              </button>
              <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '12px' }}>
                <Edit3 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Routine View Modal */}
      {selectedRoutine && (
        <div className="modal-overlay" onClick={() => setSelectedRoutine(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Workout Routine — {selectedRoutine.member_name}</h2>
              <button className="modal-close" onClick={() => setSelectedRoutine(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-accent)', marginBottom: '4px' }}>{selectedRoutine.plan_name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Target: {selectedRoutine.target_goal}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedRoutine.schedule_days.map((d, idx) => (
                  <div key={idx} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{d.day} &bull; {d.focus}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Includes {d.exercises_count} compound & isolation sets with 90s rest intervals.
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={() => setSelectedRoutine(null)}>
                Close Workout Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCards;
