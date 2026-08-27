const { Client } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to Database. Starting seed process...');

    // 1. Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL, -- 'MASTER_ADMIN', 'NODAL_MANAGER', 'GYM_ADMIN'
        city_id UUID REFERENCES cities(id),
        gym_id UUID REFERENCES gyms(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table admin_users verified/created.');

    // 2. Insert City
    const cityRes = await client.query(`
      INSERT INTO cities (name) VALUES ('Mumbai') RETURNING id;
    `);
    const cityId = cityRes.rows[0].id;
    console.log(`Created City (Mumbai) with ID: ${cityId}`);

    // 3. Insert Gym
    const gymRes = await client.query(`
      INSERT INTO gyms (city_id, name, address) 
      VALUES ($1, 'Andheri Branch', 'Lokhandwala, Andheri West') 
      RETURNING id;
    `, [cityId]);
    const gymId = gymRes.rows[0].id;
    console.log(`Created Gym (Andheri Branch) with ID: ${gymId}`);

    // 4. Insert Master Admin User
    const hashedPassword = await bcrypt.hash('password123', 10);
    await client.query(`
      INSERT INTO admin_users (email, password_hash, role) 
      VALUES ($1, $2, 'MASTER_ADMIN')
      ON CONFLICT (email) DO NOTHING;
    `, ['admin@glowrep.com', hashedPassword]);
    console.log('Created Master Admin user (admin@glowrep.com / password123)');

    // 5. Insert Members
    console.log('Inserting 10 dummy members...');
    const members = [];
    for (let i = 1; i <= 10; i++) {
      const isExpired = i > 8; // 2 expired members
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (isExpired ? -10 : 30)); // 10 days ago or 30 days ahead
      
      const memRes = await client.query(`
        INSERT INTO members (gym_id, city_id, name, phone, email, status, membership_expiry)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
      `, [
        gymId, 
        cityId, 
        `Test Member ${i}`, 
        `987654321${i % 10}`, 
        `member${i}@test.com`,
        isExpired ? 'EXPIRED' : 'ACTIVE',
        expiryDate
      ]);
      members.push(memRes.rows[0].id);
    }

    // 6. Insert Sales
    console.log('Inserting dummy sales for today...');
    await client.query(`
      INSERT INTO sales (gym_id, city_id, amount, payment_method, status)
      VALUES 
      ($1, $2, 5000, 'CASH', 'COMPLETED'),
      ($1, $2, 10000, 'UPI', 'COMPLETED'),
      ($1, $2, 4500, 'UPI', 'COMPLETED')
    `, [gymId, cityId]);

    // 7. Insert Attendance for today
    console.log('Inserting dummy attendance for today...');
    for (let i = 0; i < 5; i++) {
      await client.query(`
        INSERT INTO attendance (gym_id, member_id)
        VALUES ($1, $2)
      `, [gymId, members[i]]);
    }

    console.log('✅ Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
  }
}

seed();
