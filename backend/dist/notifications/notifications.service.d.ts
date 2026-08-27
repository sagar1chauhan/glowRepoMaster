import { ConfigService } from '@nestjs/config';
export interface WhatsAppMessage {
    phone: string;
    template_name: string;
    template_params: Record<string, string>;
}
export declare class NotificationsService {
    private readonly configService;
    private readonly logger;
    private readonly msg91AuthKey;
    private readonly msg91SenderId;
    constructor(configService: ConfigService);
    sendWhatsApp(message: WhatsAppMessage): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    sendRenewalReminder(phone: string, memberName: string, expiryDate: string, gymName: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    sendPaymentReceipt(phone: string, memberName: string, amount: string, planName: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    sendMilestoneBadge(phone: string, memberName: string, milestone: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
    sendWelcomeMessage(phone: string, memberName: string, gymName: string): Promise<{
        success: boolean;
        messageId?: string;
    }>;
}
