import React, { useState } from 'react';
import { Utensils, Plus, Search } from 'lucide-react';

interface DietPlan {
  id: string;
  name: string;
  category: 'VEG' | 'NON_VEG' | 'VEGAN' | 'KETO' | 'HIGH_PROTEIN';
  target_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals: {
    meal_time: string;
    items: string;
    calories: number;
  }[];
  assigned_members_count: number;
}

const INITIAL_DIETS: DietPlan[] = [
  {
    id: 'dp-1',
    name: '2400 kcal Lean Muscle Bulking (High Protein Non-Veg)',
    category: 'HIGH_PROTEIN',
    target_calories: 2400,
    protein_g: 175,
    carbs_g: 260,
    fat_g: 65,
    assigned_members_count: 24,
    meals: [
      { meal_time: 'Breakfast (8:00 AM)', items: '4 Egg whites + 2 whole eggs, 2 slices whole wheat toast, 1 banana', calories: 520 },
      { meal_time: 'Mid-Morning (11:00 AM)', items: '1 scoop Whey protein with 300ml milk, 15 almonds', calories: 340 },
      { meal_time: 'Lunch (1:30 PM)', items: '180g Grilled Chicken Breast, 1 cup Brown Rice, Green salad, Dal', calories: 650 },
      { meal_time: 'Pre-Workout (5:30 PM)', items: '1 bowl Oatmeal with peanut butter and apple slices', calories: 380 },
      { meal_time: 'Dinner (8:30 PM)', items: '150g Paneer/Fish, 2 Multigrain Rotis, Steamed Broccoli & Veggies', calories: 510 },
    ],
  },
  {
    id: 'dp-2',
    name: '1600 kcal Fat Loss & Shredding (Vegetarian)',
    category: 'VEG',
    target_calories: 1600,
    protein_g: 120,
    carbs_g: 160,
    fat_g: 45,
    assigned_members_count: 38,
    meals: [
      { meal_time: 'Breakfast (8:30 AM)', items: 'Sprouts salad with paneer cubes, Green tea with lemon', calories: 320 },
      { meal_time: 'Lunch (1:00 PM)', items: '1.5 cup Quinoa / Brown Rice, 1 bowl soya chunks curry, Cucumber raita', calories: 480 },
      { meal_time: 'Evening Snack (5:00 PM)', items: 'Roasted Makhana, 1 glass Buttermilk (Chaas)', calories: 180 },
      { meal_time: 'Dinner (8:00 PM)', items: 'Tofu stir fry with bell peppers & mushrooms, 1 Jowar Roti', calories: 420 },
      { meal_time: 'Post-Dinner (9:30 PM)', items: '1 glass warm turmeric milk with cinnamon', calories: 200 },
    ],
  },
  {
    id: 'dp-3',
    name: '2000 kcal Keto Low-Carb Performance',
    category: 'KETO',
    target_calories: 2000,
    protein_g: 140,
    carbs_g: 30,
    fat_g: 145,
    assigned_members_count: 12,
    meals: [
      { meal_time: 'Breakfast', items: 'Omelette made with 3 eggs, cheese & spinach in olive oil', calories: 550 },
      { meal_time: 'Lunch', items: 'Avocado chicken salad with walnuts & parmesan cheese', calories: 680 },
      { meal_time: 'Snack', items: 'Handful of walnuts, chia seed pudding with almond milk', calories: 280 },
      { meal_time: 'Dinner', items: 'Grilled salmon fillet with butter garlic asparagus', calories: 490 },
    ],
  },
];

export const DietPlanManagement: React.FC = () => {
  const [plans] = useState<DietPlan[]>(INITIAL_DIETS);
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);

  const filtered = plans.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Utensils size={24} style={{ color: 'var(--color-success)' }} />
            Diet Plan & Nutrition Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Build macro-calculated meal templates, assign customized diets to members, and track nutritional goals.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => alert('Opening Diet Plan Builder')}>
          <Plus size={16} /> Create Diet Plan
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search diet plan by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map((plan) => (
          <div key={plan.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge badge-active">{plan.category.replace('_', ' ')}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  👤 {plan.assigned_members_count} Members Enrolled
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text)' }}>
                {plan.name}
              </h3>

              {/* Macro Nutrients Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 171, 64, 0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-warning)', fontWeight: 600 }}>CALORIES</div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{plan.target_calories}</div>
                </div>
                <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>PROTEIN</div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{plan.protein_g}g</div>
                </div>
                <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>CARBS</div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{plan.carbs_g}g</div>
                </div>
                <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>FATS</div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{plan.fat_g}g</div>
                </div>
              </div>

              {/* Meals Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {plan.meals.slice(0, 3).map((m, mIdx) => (
                  <div
                    key={mIdx}
                    style={{
                      padding: '8px 10px',
                      background: 'rgba(0, 0, 0, 0.15)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{m.meal_time}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.items}
                    </div>
                  </div>
                ))}
                {plan.meals.length > 3 && (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    +{plan.meals.length - 3} more meals included
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                onClick={() => setSelectedPlan(plan)}
              >
                View Full Diet Chart
              </button>
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                Assign to Member
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
          <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🥗 {selectedPlan.name}</h2>
              <button className="modal-close" onClick={() => setSelectedPlan(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 171, 64, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-warning)' }}>ENERGY</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPlan.target_calories} kcal</div>
                </div>
                <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>PROTEIN</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPlan.protein_g}g</div>
                </div>
                <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-accent)' }}>CARBS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPlan.carbs_g}g</div>
                </div>
                <div style={{ background: 'rgba(108, 92, 231, 0.1)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-primary)' }}>FATS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>{selectedPlan.fat_g}g</div>
                </div>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>🍽️ Full Daily Meal Breakdown:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedPlan.meals.map((m, idx) => (
                  <div key={idx} style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-success)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--color-text)' }}>{m.meal_time}</strong>
                      <span className="badge" style={{ background: 'rgba(255, 171, 64, 0.15)', color: 'var(--color-warning)' }}>
                        {m.calories} kcal
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{m.items}</div>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={() => setSelectedPlan(null)}>
                Close Diet Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanManagement;
