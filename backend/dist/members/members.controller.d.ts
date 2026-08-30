import { MembersService } from './members.service';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    findAll(req: any): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    create(req: any, data: any): Promise<any>;
    update(req: any, id: string, data: any): Promise<any>;
}
