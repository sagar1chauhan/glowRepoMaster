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

  async create(context: TenantContext, data: any) {
    const query = `
      INSERT INTO members (gym_id, city_id, name, phone, email, status, membership_expiry)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [
      data.gym_id || context.gym_id,
      data.city_id || context.city_id,
      data.name,
      data.phone,
      data.email,
      data.status || 'ACTIVE',
      data.membership_expiry
    ];
    const result = await this.db.queryWithContext(query, params, context);
    return result[0];
  }
}
