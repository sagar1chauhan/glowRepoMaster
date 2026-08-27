"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let NotificationsService = NotificationsService_1 = class NotificationsService {
    configService;
    logger = new common_1.Logger(NotificationsService_1.name);
    msg91AuthKey;
    msg91SenderId;
    constructor(configService) {
        this.configService = configService;
        this.msg91AuthKey = this.configService.get('MSG91_AUTH_KEY', '');
        this.msg91SenderId = this.configService.get('MSG91_SENDER_ID', 'GLWREP');
        if (!this.msg91AuthKey) {
            this.logger.warn('MSG91_AUTH_KEY not set — WhatsApp notifications will run in MOCK mode');
        }
    }
    async sendWhatsApp(message) {
        const phone = message.phone.startsWith('91') ? message.phone : `91${message.phone}`;
        if (!this.msg91AuthKey) {
            this.logger.log(`[MOCK WhatsApp] To: ${phone} | Template: ${message.template_name} | Params: ${JSON.stringify(message.template_params)}`);
            return { success: true, messageId: `mock_wa_${Date.now()}` };
        }
        try {
            const response = await axios_1.default.post('https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/', {
                integrated_number: this.msg91SenderId,
                content_type: 'template',
                payload: {
                    messaging_product: 'whatsapp',
                    type: 'template',
                    template: {
                        name: message.template_name,
                        language: { code: 'en', policy: 'deterministic' },
                        namespace: this.configService.get('MSG91_NAMESPACE', ''),
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
            }, {
                headers: {
                    authkey: this.msg91AuthKey,
                    'Content-Type': 'application/json',
                },
            });
            this.logger.log(`WhatsApp sent to ${phone}: ${response.data?.message || 'OK'}`);
            return { success: true, messageId: response.data?.request_id };
        }
        catch (error) {
            this.logger.error(`WhatsApp failed to ${phone}: ${error.message}`);
            return { success: false };
        }
    }
    async sendRenewalReminder(phone, memberName, expiryDate, gymName) {
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
    async sendPaymentReceipt(phone, memberName, amount, planName) {
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
    async sendMilestoneBadge(phone, memberName, milestone) {
        return this.sendWhatsApp({
            phone,
            template_name: 'workout_milestone',
            template_params: {
                member_name: memberName,
                milestone,
            },
        });
    }
    async sendWelcomeMessage(phone, memberName, gymName) {
        return this.sendWhatsApp({
            phone,
            template_name: 'welcome_member',
            template_params: {
                member_name: memberName,
                gym_name: gymName,
            },
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map