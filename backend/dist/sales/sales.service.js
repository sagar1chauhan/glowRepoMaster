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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let SalesService = class SalesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getDailyReport(context) {
        const query = `
      SELECT SUM(amount) as total_sales, payment_method 
      FROM sales 
      WHERE DATE(created_at) = CURRENT_DATE 
      GROUP BY payment_method
    `;
        const result = await this.db.queryWithContext(query, [], context);
        let cash = 0;
        let upi = 0;
        result.forEach(row => {
            if (row.payment_method === 'CASH')
                cash = parseFloat(row.total_sales);
            if (row.payment_method === 'UPI')
                upi = parseFloat(row.total_sales);
        });
        return { cash, upi, total: cash + upi };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SalesService);
//# sourceMappingURL=sales.service.js.map