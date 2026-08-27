import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    getDailyReport(req: any): Promise<{
        cash: number;
        upi: number;
        total: number;
    }>;
}
