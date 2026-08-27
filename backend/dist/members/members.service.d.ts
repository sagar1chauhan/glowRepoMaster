import { DatabaseService, TenantContext } from '../database/database.service';
export declare class MembersService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(context: TenantContext): Promise<any[]>;
    create(context: TenantContext, data: any): Promise<any>;
}
