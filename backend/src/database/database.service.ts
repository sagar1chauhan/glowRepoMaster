import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

export interface TenantContext {
  role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN';
  city_id?: string;
  gym_id?: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      // Provide appropriate database connection info via env variables in production
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/glowrep',
    });
  }

  async onModuleInit() {
    // Initialization logic if necessary
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  /**
   * Executes a database query within a transaction that has the RLS
   * context explicitly set according to the user's tenant properties.
   */
  async queryWithContext<T = any>(
    queryText: string,
    params: any[],
    context: TenantContext,
  ): Promise<T[]> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Set the context parameters safely as local transaction variables (is_local = true)
      await client.query(`SELECT set_config('app.user_role', $1, true)`, [context.role]);
      
      if (context.city_id) {
        await client.query(`SELECT set_config('app.current_city_id', $1, true)`, [context.city_id]);
      }
      
      if (context.gym_id) {
        await client.query(`SELECT set_config('app.current_gym_id', $1, true)`, [context.gym_id]);
      }

      // Execute the requested query under the enforced RLS context
      const result = await client.query(queryText, params);
      
      await client.query('COMMIT');
      return result.rows;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * Direct query execution, bypassing specific local RLS configurations.
   * Useful for internal lookups, Master Admin tasks that bypass policies, or initial auth.
   */
  async query<T = any>(queryText: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(queryText, params);
    return result.rows;
  }
}
