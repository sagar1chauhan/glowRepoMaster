-- database/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: cities
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: gyms
CREATE TABLE gyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID NOT NULL REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: members
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id),
    city_id UUID NOT NULL REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    membership_expiry DATE,
    renewal_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: sales
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id),
    city_id UUID NOT NULL REFERENCES cities(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'CASH', 'UPI'
    status VARCHAR(50) DEFAULT 'PENDING',
    razorpay_link_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id),
    member_id UUID NOT NULL REFERENCES members(id),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on core tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Dynamic Tenant Context Isolation Policy for Members
CREATE POLICY gym_isolation_policy ON members
 FOR ALL
 USING (
    -- Master Admin bypass
    current_setting('app.user_role', true) = 'MASTER_ADMIN'
    OR
    -- Nodal Manager sees their specific city
    (current_setting('app.user_role', true) = 'NODAL_MANAGER' 
     AND city_id = current_setting('app.current_city_id', true)::uuid)
    OR
    -- Gym Admin sees only their branch
    gym_id = current_setting('app.current_gym_id', true)::uuid
 );

-- Dynamic Tenant Context Isolation Policy for Sales
CREATE POLICY gym_isolation_policy_sales ON sales
 FOR ALL
 USING (
    current_setting('app.user_role', true) = 'MASTER_ADMIN'
    OR
    (current_setting('app.user_role', true) = 'NODAL_MANAGER' AND city_id = current_setting('app.current_city_id', true)::uuid)
    OR
    gym_id = current_setting('app.current_gym_id', true)::uuid
 );

-- Dynamic Tenant Context Isolation Policy for Attendance
CREATE POLICY gym_isolation_policy_attendance ON attendance
 FOR ALL
 USING (
    current_setting('app.user_role', true) = 'MASTER_ADMIN'
    OR
    (current_setting('app.user_role', true) = 'NODAL_MANAGER' AND gym_id IN (SELECT id FROM gyms WHERE city_id = current_setting('app.current_city_id', true)::uuid))
    OR
    gym_id = current_setting('app.current_gym_id', true)::uuid
 );

-- Table: admin_users (Multi-role support: MASTER_ADMIN, NODAL_MANAGER, GYM_ADMIN)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'MASTER_ADMIN', 'NODAL_MANAGER', 'GYM_ADMIN'
    name VARCHAR(255),
    city_id UUID REFERENCES cities(id),
    gym_id UUID REFERENCES gyms(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

