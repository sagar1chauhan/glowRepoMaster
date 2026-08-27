import { PaymentsService } from './payments.service';
import type { CreatePaymentLinkDto } from './payments.service';
import { DatabaseService } from '../database/database.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly databaseService;
    constructor(paymentsService: PaymentsService, databaseService: DatabaseService);
    createPaymentLink(dto: CreatePaymentLinkDto, req: any): Promise<import("./payments.service").PaymentRecord>;
    handleWebhook(body: any, signature: string, req: any): Promise<{
        status: string;
        event?: undefined;
    } | {
        status: string;
        event: any;
    }>;
    logCashPayment(body: {
        amount: number;
        member_name: string;
        notes?: string;
    }, req: any): Promise<any>;
    getDailyReconciliation(date: string, req: any): Promise<{
        date: string;
        gym_id: any;
        cash: {
            transactions: number;
            total: number;
        };
        upi: {
            transactions: number;
            total: number;
        };
        grand_total: number;
    }>;
}
