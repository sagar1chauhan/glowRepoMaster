import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WhatsAppMessage {
  phone: string; // Indian phone number (10 digits)
  template_name: string;
  template_params: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly msg91AuthKey: string;
  private readonly msg91SenderId: string;

  constructor(private readonly configService: ConfigService) {
    this.msg91AuthKey = this.configService.get<string>('MSG91_AUTH_KEY', '');
    this.msg91SenderId = this.configService.get<string>('MSG91_SENDER_ID', 'GLWREP');

    if (!this.msg91AuthKey) {
      this.logger.warn('MSG91_AUTH_KEY not set — WhatsApp notifications will run in MOCK mode');
    }
  }

  /**
   * Send a WhatsApp template message via MSG91 / Interakt.
   * Falls back to mock/log mode if API keys are not configured.
   */
  async sendWhatsApp(message: WhatsAppMessage): Promise<{ success: boolean; messageId?: string }> {
    const phone = message.phone.startsWith('91') ? message.phone : `91${message.phone}`;

    if (!this.msg91AuthKey) {
      this.logger.log(`[MOCK WhatsApp] To: ${phone} | Template: ${message.template_name} | Params: ${JSON.stringify(message.template_params)}`);
      return { success: true, messageId: `mock_wa_${Date.now()}` };
    }

    try {
      const response = await axios.post(
        'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/',
        {
          integrated_number: this.msg91SenderId,
          content_type: 'template',
          payload: {
            messaging_product: 'whatsapp',
            type: 'template',
            template: {
              name: message.template_name,
              language: { code: 'en', policy: 'deterministic' },
              namespace: this.configService.get<string>('MSG91_NAMESPACE', ''),
              to_and_components: [
                {
                  to: [phone],
                  components: {
                    body_1: Object.values(message.template_params),
                  },
                },
              ],
            },
          },
        },
        {
          headers: {
            authkey: this.msg91AuthKey,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`WhatsApp sent to ${phone}: ${response.data?.message || 'OK'}`);
      return { success: true, messageId: response.data?.request_id };
    } catch (error: any) {
      this.logger.error(`WhatsApp failed to ${phone}: ${error.message}`);
      return { success: false };
    }
  }

  /**
   * Pre-built templates for common GlowRep scenarios
   */

  // 7-day renewal reminder
  async sendRenewalReminder(phone: string, memberName: string, expiryDate: string, gymName: string) {
    return this.sendWhatsApp({
      phone,
      template_name: 'renewal_reminder_7day',
      template_params: {
        member_name: memberName,
        expiry_date: expiryDate,
        gym_name: gymName,
      },
    });
  }

  // Instant payment receipt
  async sendPaymentReceipt(phone: string, memberName: string, amount: string, planName: string) {
    return this.sendWhatsApp({
      phone,
      template_name: 'payment_receipt',
      template_params: {
        member_name: memberName,
        amount: `₹${amount}`,
        plan_name: planName,
      },
    });
  }

  // Workout milestone badge
  async sendMilestoneBadge(phone: string, memberName: string, milestone: string) {
    return this.sendWhatsApp({
      phone,
      template_name: 'workout_milestone',
      template_params: {
        member_name: memberName,
        milestone,
      },
    });
  }

  // Welcome message after onboarding
  async sendWelcomeMessage(phone: string, memberName: string, gymName: string) {
    return this.sendWhatsApp({
      phone,
      template_name: 'welcome_member',
      template_params: {
        member_name: memberName,
        gym_name: gymName,
      },
    });
  }
}
