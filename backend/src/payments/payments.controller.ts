import { Controller, Post, Body, Headers, Req, UseGuards, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import type { CreatePaymentLinkDto } from './payments.service';
import { DatabaseService } from '../database/database.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * POST /payments/create-link
   * Creates a Razorpay UPI payment link for a member's subscription.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create-link')
  async createPaymentLink(@Body() dto: CreatePaymentLinkDto, @Req() req: any) {
    const user = req.user;
    // Use the logged-in user's gym context if not provided
    dto.gym_id = dto.gym_id || user.gym_id;
    dto.city_id = dto.city_id || user.city_id;

    const paymentRecord = await this.paymentsService.createPaymentLink(dto);

    // Log the sale in the database
    await this.databaseService.query(
      `INSERT INTO sales (gym_id, city_id, amount, payment_method, razorpay_link_id, status)
       VALUES ($1, $2, $3, 'UPI', $4, $5)`,
      [dto.gym_id, dto.city_id, dto.amount, paymentRecord.razorpay_payment_link_id, paymentRecord.status],
    );

    return paymentRecord;
  }

  /**
   * POST /payments/webhook
   * Razorpay webhook endpoint to receive payment confirmations.
   */
  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: any,
  ) {
    const rawBody = JSON.stringify(body);
    const isValid = this.paymentsService.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      return { status: 'invalid_signature' };
    }

    const event = body.event;
    if (event === 'payment_link.paid') {
      const paymentLinkId = body.payload?.payment_link?.entity?.id;
      const paymentId = body.payload?.payment?.entity?.id;

      // Update sale status to PAID
      await this.databaseService.query(
        `UPDATE sales SET status = 'PAID', razorpay_payment_id = $1 WHERE razorpay_link_id = $2`,
        [paymentId, paymentLinkId],
      );

      return { status: 'ok', event };
    }

    return { status: 'ok', event };
  }

  /**
   * POST /payments/log-cash
   * Logs a manual cash payment at the front desk.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('log-cash')
  async logCashPayment(
    @Body() body: { amount: number; member_name: string; notes?: string },
    @Req() req: any,
  ) {
    const user = req.user;
    const result = await this.databaseService.query(
      `INSERT INTO sales (gym_id, city_id, amount, payment_method, status, notes)
       VALUES ($1, $2, $3, 'CASH', 'PAID', $4) RETURNING *`,
      [user.gym_id, user.city_id, body.amount, body.notes || `Cash: ${body.member_name}`],
    );
    return result[0];
  }

  /**
   * GET /payments/reconciliation
   * End-of-day register closure: tallies Cash vs UPI for a gym on a specific date.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('reconciliation')
  async getDailyReconciliation(@Query('date') date: string, @Req() req: any) {
    const user = req.user;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const result = await this.databaseService.queryWithContext(
      `SELECT 
        payment_method,
        COUNT(*) as transaction_count,
        SUM(amount) as total_amount
       FROM sales
       WHERE DATE(created_at) = $1
       GROUP BY payment_method
       ORDER BY payment_method`,
      [targetDate],
      { role: user.role, gym_id: user.gym_id, city_id: user.city_id },
    );

    const cashTotal = result.find((r: any) => r.payment_method === 'CASH');
    const upiTotal = result.find((r: any) => r.payment_method === 'UPI');

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
}
