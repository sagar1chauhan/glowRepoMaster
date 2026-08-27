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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const payments_service_1 = require("./payments.service");
const database_service_1 = require("../database/database.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    databaseService;
    constructor(paymentsService, databaseService) {
        this.paymentsService = paymentsService;
        this.databaseService = databaseService;
    }
    async createPaymentLink(dto, req) {
        const user = req.user;
        dto.gym_id = dto.gym_id || user.gym_id;
        dto.city_id = dto.city_id || user.city_id;
        const paymentRecord = await this.paymentsService.createPaymentLink(dto);
        await this.databaseService.query(`INSERT INTO sales (gym_id, city_id, amount, payment_method, razorpay_link_id, status)
       VALUES ($1, $2, $3, 'UPI', $4, $5)`, [dto.gym_id, dto.city_id, dto.amount, paymentRecord.razorpay_payment_link_id, paymentRecord.status]);
        return paymentRecord;
    }
    async handleWebhook(body, signature, req) {
        const rawBody = JSON.stringify(body);
        const isValid = this.paymentsService.verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            return { status: 'invalid_signature' };
        }
        const event = body.event;
        if (event === 'payment_link.paid') {
            const paymentLinkId = body.payload?.payment_link?.entity?.id;
            const paymentId = body.payload?.payment?.entity?.id;
            await this.databaseService.query(`UPDATE sales SET status = 'PAID', razorpay_payment_id = $1 WHERE razorpay_link_id = $2`, [paymentId, paymentLinkId]);
            return { status: 'ok', event };
        }
        return { status: 'ok', event };
    }
    async logCashPayment(body, req) {
        const user = req.user;
        const result = await this.databaseService.query(`INSERT INTO sales (gym_id, city_id, amount, payment_method, status, notes)
       VALUES ($1, $2, $3, 'CASH', 'PAID', $4) RETURNING *`, [user.gym_id, user.city_id, body.amount, body.notes || `Cash: ${body.member_name}`]);
        return result[0];
    }
    async getDailyReconciliation(date, req) {
        const user = req.user;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const result = await this.databaseService.queryWithContext(`SELECT 
        payment_method,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
       FROM sales
       WHERE DATE(created_at) = $1
       GROUP BY payment_method
       ORDER BY payment_method`, [targetDate], { role: user.role, gym_id: user.gym_id, city_id: user.city_id });
        const cashTotal = result.find((r) => r.payment_method === 'CASH');
        const upiTotal = result.find((r) => r.payment_method === 'UPI');
        return {
            date: targetDate,
            gym_id: user.gym_id,
            cash: {
                transactions: parseInt(cashTotal?.transaction_count || '0'),
                total: parseFloat(cashTotal?.total_amount || '0'),
            },
            upi: {
                transactions: parseInt(upiTotal?.transaction_count || '0'),
                total: parseFloat(upiTotal?.total_amount || '0'),
            },
            grand_total: parseFloat(cashTotal?.total_amount || '0') + parseFloat(upiTotal?.total_amount || '0'),
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('create-link'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPaymentLink", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-razorpay-signature')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('log-cash'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "logCashPayment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('reconciliation'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getDailyReconciliation", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        database_service_1.DatabaseService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map