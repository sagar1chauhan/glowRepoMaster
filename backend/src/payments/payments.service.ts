import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

export interface CreatePaymentLinkDto {
  amount: number; // in INR (e.g., 2999 for ₹2999)
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

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay | null = null;

  constructor(private readonly configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.logger.log('Razorpay SDK initialized');
    } else {
      this.logger.warn('Razorpay keys not set — running in MOCK mode');
    }
  }

  /**
   * Creates a Razorpay Payment Link with UPI AutoPay support.
   * If Razorpay keys are not configured, returns a mock response.
   */
  async createPaymentLink(dto: CreatePaymentLinkDto): Promise<PaymentRecord> {
    if (!this.razorpay) {
      // MOCK MODE — return fake payment link for dev/testing
      this.logger.log(`[MOCK] Creating payment link for ₹${dto.amount} → ${dto.member_name}`);
      return {
        razorpay_payment_link_id: `mock_pl_${Date.now()}`,
        amount: dto.amount,
        status: 'created',
        short_url: `https://rzp.io/mock/${Date.now()}`,
      };
    }

    const paymentLink = await this.razorpay.paymentLink.create({
      amount: dto.amount * 100, // Razorpay expects paise
      currency: 'INR',
      accept_partial: false,
      description: dto.description,
      customer: {
        name: dto.member_name,
        contact: `+91${dto.member_phone}`,
        email: dto.member_email || undefined,
      },
      notify: {
        sms: true,
        email: !!dto.member_email,
        whatsapp: true,
      },
      reminder_enable: true,
      notes: {
        gym_id: dto.gym_id,
        city_id: dto.city_id,
      },
      callback_url: `${this.configService.get<string>('APP_URL', 'http://localhost:3001')}/payments/callback`,
      callback_method: 'get',
    });

    this.logger.log(`Payment link created: ${paymentLink.short_url}`);
    return {
      razorpay_payment_link_id: paymentLink.id,
      amount: dto.amount,
      status: paymentLink.status,
      short_url: paymentLink.short_url,
    };
  }

  /**
   * Verifies a Razorpay webhook signature for payment confirmation.
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    if (!this.razorpay) {
      this.logger.log('[MOCK] Webhook signature verification — always true in mock mode');
      return true;
    }

    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET', '');
    try {
      Razorpay.validateWebhookSignature(body, signature, webhookSecret);
      return true;
    } catch {
      return false;
    }
  }
}
