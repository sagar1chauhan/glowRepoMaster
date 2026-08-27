import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export interface TenantContext {
    role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN';
    city_id?: string;
    gym_id?: string;
}
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    queryWithContext<T = any>(queryText: string, params: any[], context: TenantContext): Promise<T[]>;
    query<T = any>(queryText: string, params?: any[]): Promise<T[]>;
}
