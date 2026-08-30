import React, { useState } from 'react';
import { Dumbbell, Plus, Search, Info } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  muscle_group: 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE' | 'CARDIO';
  equipment: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  target_muscle: string;
  instructions: string;
}

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Flat Bench Press',
    muscle_group: 'CHEST',
    equipment: 'Barbell & Flat Bench',
    difficulty: 'INTERMEDIATE',
    target_muscle: 'Pectoralis Major, Anterior Deltoid, Triceps',
    instructions: 'Lie flat, grip bar slightly wider than shoulder width. Lower bar to mid-chest with elbows at 45 deg, press up forcefully.',
  },
  {
    id: 'ex-2',
    name: 'Incline Dumbbell Press',
    muscle_group: 'CHEST',
    equipment: 'Dumbbells & 30-degree Incline Bench',
    difficulty: 'BEGINNER',
    target_muscle: 'Upper Clavicular Pectorals',
    instructions: 'Press dumbbells up in a controlled arc, squeezing upper chest at the peak.',
  },
  {
    id: 'ex-3',
    name: 'Conventional Barbell Deadlift',
    muscle_group: 'BACK',
    equipment: 'Olympic Barbell & Bumper Plates',
    difficulty: 'ADVANCED',
    target_muscle: 'Erector Spinae, Latissimus Dorsi, Glutes, Hamstrings',
    instructions: 'Stand with feet hip-width apart. Hinge at hips, grip bar, keep flat back, drive through heels to lockout.',
  },
  {
    id: 'ex-4',
    name: 'Lat Pulldown (Wide Grip)',
    muscle_group: 'BACK',
    equipment: 'Cable Pulldown Machine',
    difficulty: 'BEGINNER',
    target_muscle: 'Latissimus Dorsi, Teres Major, Biceps',
    instructions: 'Pull bar down towards upper chest while pulling shoulder blades down and back.',
  },
  {
    id: 'ex-5',
    name: 'Barbell Back Squat',
    muscle_group: 'LEGS',
    equipment: 'Squat Rack & Barbell',
    difficulty: 'INTERMEDIATE',
    target_muscle: 'Quadriceps, Gluteus Maximus, Adductors',
    instructions: 'Rest bar across traps. Squat down until thighs are parallel to floor, keep chest tall and knees tracking toes.',
  },
  {
    id: 'ex-6',
    name: 'Standing Dumbbell Lateral Raise',
    muscle_group: 'SHOULDERS',
    equipment: 'Dumbbells',
    difficulty: 'BEGINNER',
    target_muscle: 'Lateral Deltoids (Side Delts)',
    instructions: 'Raise dumbbells to sides up to shoulder height with a slight forward tilt, controlled descent.',
  },
  {
    id: 'ex-7',
    name: 'Incline Dumbbell Bicep Curl',
    muscle_group: 'ARMS',
    equipment: 'Incline Bench & Dumbbells',
    difficulty: 'INTERMEDIATE',
    target_muscle: 'Biceps Brachii (Long Head)',
    instructions: 'Sit on incline bench. Curl dumbbells while keeping elbows stationary for maximum deep bicep stretch.',
  },
];

export const WorkoutLibrary: React.FC = () => {
  const [exercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('ALL');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filtered = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || ex.target_muscle.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'ALL' || ex.muscle_group === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Dumbbell size={24} style={{ color: 'var(--color-accent)' }} />
            Exercise & Workout Library
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Comprehensive exercise database with target muscle groups, setup instructions, and difficulty tags.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('New Exercise Creator')}>
          <Plus size={16} /> Add Exercise
        </button>
      </div>

      {/* Muscle Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {['ALL', 'CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'CARDIO'].map((mg) => (
          <button
            key={mg}
            onClick={() => setSelectedMuscle(mg)}
            className={`btn btn-secondary ${selectedMuscle === mg ? 'active' : ''}`}
            style={{
              fontSize: '12px',
              padding: '8px 16px',
              whiteSpace: 'nowrap',
              borderColor: selectedMuscle === mg ? 'var(--color-primary)' : 'var(--color-border)',
              background: selectedMuscle === mg ? 'rgba(108, 92, 231, 0.2)' : undefined,
            }}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search exercises by name or muscle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Exercise Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((ex) => (
          <div key={ex.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--color-accent)' }}>
                  {ex.muscle_group}
                </span>
                <span
                  className="badge"
                  style={{
                    background:
                      ex.difficulty === 'BEGINNER'
                        ? 'rgba(0, 230, 118, 0.15)'
                        : ex.difficulty === 'INTERMEDIATE'
                        ? 'rgba(255, 171, 64, 0.15)'
                        : 'rgba(255, 82, 82, 0.15)',
                    color:
                      ex.difficulty === 'BEGINNER'
                        ? 'var(--color-success)'
                        : ex.difficulty === 'INTERMEDIATE'
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)',
                  }}
                >
                  {ex.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{ex.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                🏋️ <strong>Equipment:</strong> {ex.equipment}
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>TARGET MUSCLES</div>
                <div style={{ fontSize: '13px', color: 'var(--color-accent)', marginTop: '2px' }}>{ex.target_muscle}</div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                {ex.instructions}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '16px' }}>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}
                onClick={() => setActiveExercise(ex)}
              >
                <Info size={14} /> Exercise Technique & Demo
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Technique Modal */}
      {activeExercise && (
        <div className="modal-overlay" onClick={() => setActiveExercise(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏋️ {activeExercise.name}</h2>
              <button className="modal-close" onClick={() => setActiveExercise(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge badge-active">{activeExercise.muscle_group}</span>
                  <span className="badge badge-pending">{activeExercise.difficulty}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>Equipment Required: {activeExercise.equipment}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-accent)', marginTop: '4px' }}>Target: {activeExercise.target_muscle}</div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>Form & Execution Cue:</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                {activeExercise.instructions}
              </p>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={() => setActiveExercise(null)}>
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLibrary;
