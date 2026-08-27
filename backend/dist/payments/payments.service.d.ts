import { ConfigService } from '@nestjs/config';
export interface CreatePaymentLinkDto {
    amount: number;
    member_name: string;
    member_phone: string;
    member_email?: string;
    description: string;
    gym_id: string;
    city_id: string;
}
export interface PaymentRecord {
    razorpay_payment_link_id: string;
    razorpay_payment_id?: string;
    amount: number;
    status: string;
    short_url: string;
}
export declare class PaymentsService {
    private readonly configService;
    private readonly logger;
    private razorpay;
    constructor(configService: ConfigService);
    createPaymentLink(dto: CreatePaymentLinkDto): Promise<PaymentRecord>;
    verifyWebhookSignature(body: string, signature: string): boolean;
}
