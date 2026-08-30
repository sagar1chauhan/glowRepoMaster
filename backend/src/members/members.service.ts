import { Injectable } from '@nestjs/common';
import { DatabaseService, TenantContext } from '../database/database.service';

@Injectable()
export class MembersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(context: TenantContext) {
    const query = `
      SELECT id, gym_id, city_id, name, phone, email, status, membership_expiry, created_at 
      FROM members 
      ORDER BY created_at DESC
    `;
    return this.db.queryWithContext(query, [], context);
  }

  async findOne(context: TenantContext, id: string) {
    // Fetch the member
    const memberQuery = `
      SELECT id, gym_id, city_id, name, phone, email, status, membership_expiry, created_at
      FROM members
      WHERE id = $1
    `;
    const members = await this.db.queryWithContext(memberQuery, [id], context);
    if (members.length === 0) return null;

    // Fetch the member's recent attendance (last 20 check-ins)
    const attendanceQuery = `
      SELECT id, check_in_time
      FROM attendance
      WHERE member_id = $1
      ORDER BY check_in_time DESC
      LIMIT 20
    `;
    const attendance = await this.db.queryWithContext(attendanceQuery, [id], context);

    return { ...members[0], attendance };
  }

  async create(context: TenantContext, data: any) {
    // Resolve gym_id and city_id — MASTER_ADMIN may not have these set
    let gymId = data.gym_id || context.gym_id;
    let cityId = data.city_id || context.city_id;

    if (!gymId) {
      // Fallback: fetch the first available gym for MASTER_ADMIN
      const gyms = await this.db.query('SELECT id, city_id FROM gyms LIMIT 1');
      if (gyms.length > 0) {
        gymId = gyms[0].id;
        cityId = cityId || gyms[0].city_id;
      }
    }

    const query = `
      INSERT INTO members (gym_id, city_id, name, phone, email, status, membership_expiry)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [
      gymId,
      cityId,
      data.name,
      data.phone,
      data.email,
      data.status || 'ACTIVE',
      data.membership_expiry
    ];
    const result = await this.db.queryWithContext(query, params, context);
    return result[0];
  }

  async update(context: TenantContext, id: string, data: any) {
    const fields: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      params.push(data.name);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      params.push(data.phone);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      params.push(data.email);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      params.push(data.status);
    }
    if (data.membership_expiry !== undefined) {
      fields.push(`membership_expiry = $${paramIndex++}`);
      params.push(data.membership_expiry);
    }

    if (fields.length === 0) return null;

    params.push(id);
    const query = `
      UPDATE members
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    const result = await this.db.queryWithContext(query, params, context);
    return result[0] || null;
  }
}
