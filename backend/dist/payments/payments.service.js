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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const razorpay_1 = __importDefault(require("razorpay"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    logger = new common_1.Logger(PaymentsService_1.name);
    razorpay = null;
    constructor(configService) {
        this.configService = configService;
        const keyId = this.configService.get('RAZORPAY_KEY_ID');
        const keySecret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (keyId && keySecret) {
            this.razorpay = new razorpay_1.default({
                key_id: keyId,
                key_secret: keySecret,
            });
            this.logger.log('Razorpay SDK initialized');
        }
        else {
            this.logger.warn('Razorpay keys not set — running in MOCK mode');
        }
    }
    async createPaymentLink(dto) {
        if (!this.razorpay) {
            this.logger.log(`[MOCK] Creating payment link for ₹${dto.amount} → ${dto.member_name}`);
            return {
                razorpay_payment_link_id: `mock_pl_${Date.now()}`,
                amount: dto.amount,
                status: 'created',
                short_url: `https://rzp.io/mock/${Date.now()}`,
            };
        }
        const paymentLink = await this.razorpay.paymentLink.create({
            amount: dto.amount * 100,
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
            callback_url: `${this.configService.get('APP_URL', 'http://localhost:3001')}/payments/callback`,
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
    verifyWebhookSignature(body, signature) {
        if (!this.razorpay) {
            this.logger.log('[MOCK] Webhook signature verification — always true in mock mode');
            return true;
        }
        const webhookSecret = this.configService.get('RAZORPAY_WEBHOOK_SECRET', '');
        try {
            razorpay_1.default.validateWebhookSignature(body, signature, webhookSecret);
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map