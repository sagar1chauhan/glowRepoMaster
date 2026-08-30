import { DatabaseService, TenantContext } from '../database/database.service';
export declare class MembersService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(context: TenantContext): Promise<any[]>;
    findOne(context: TenantContext, id: string): Promise<any>;
    create(context: TenantContext, data: any): Promise<any>;
    update(context: TenantContext, id: string, data: any): Promise<any>;
}
