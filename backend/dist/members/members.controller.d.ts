import { MembersService } from './members.service';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    findAll(req: any): Promise<any[]>;
    create(req: any, data: any): Promise<any>;
}
