import React, { useState } from 'react';
import { Trophy, Plus, Star, TrendingDown } from 'lucide-react';

interface Story {
  id: string;
  member_name: string;
  duration: string;
  weight_loss_kg: number;
  trainer: string;
  story_text: string;
  rating: number;
  highlight: string;
}

const INITIAL_STORIES: Story[] = [
  {
    id: 'st-1',
    member_name: 'Ananya Sharma',
    duration: '4 Months',
    weight_loss_kg: 14.5,
    trainer: 'Coach Dev & Nutritionist Ritu',
    highlight: 'Lost 14.5 kg & 5 inches off waistline!',
    story_text: 'Started with 82kg, zero fitness background. With disciplined workout splits and high-protein vegetarian diet, I reached 67.5kg with incredible stamina!',
    rating: 5,
  },
  {
    id: 'st-2',
    member_name: 'Harish Nair',
    duration: '6 Months',
    weight_loss_kg: 21.0,
    trainer: 'Head Coach Sameer',
    highlight: 'Reversed Fatty Liver & Dropped 21 kg',
    story_text: 'The body composition assessment and personal training helped me fix my metabolism. Best gym environment with positive coaching!',
    rating: 5,
  },
  {
    id: 'st-3',
    member_name: 'Tanvi Saxena',
    duration: '3 Months',
    weight_loss_kg: 8.0,
    trainer: 'Coach Pooja',
    highlight: 'Marathon Ready & Lean Muscle Tone',
    story_text: 'Targeted strength training and mobility sessions helped me achieve a sub-60 minute 10K run while gaining lean muscle.',
    rating: 5,
  },
];

export const SuccessStories: React.FC = () => {
  const [stories] = useState<Story[]>(INITIAL_STORIES);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Trophy size={24} style={{ color: 'var(--color-warning)' }} />
            Member Success Stories & Transformations
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Showcase member weight loss milestones, strength achievements, and verified reviews.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('New Story Publisher')}>
          <Plus size={16} /> Add Transformation
        </button>
      </div>

      {/* Stories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {stories.map((story) => (
          <div key={story.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                    }}
                  >
                    {story.member_name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{story.member_name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>⏱️ {story.duration} Journey</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2px', color: 'var(--color-warning)' }}>
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-warning)" />
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: 'linear-gradient(90deg, rgba(0, 230, 118, 0.1), transparent)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--color-success)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-success)' }}>
                  🔥 {story.highlight}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Guided by {story.trainer}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.6', fontStyle: 'italic' }}>
                "{story.story_text}"
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '16px' }}>
              <span className="badge badge-active">
                <TrendingDown size={12} style={{ display: 'inline', marginRight: '4px' }} />
                -{story.weight_loss_kg} kg Reduced
              </span>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }}>
                Share Testimonial 📱
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
