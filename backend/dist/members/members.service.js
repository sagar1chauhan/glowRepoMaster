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
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let MembersService = class MembersService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(context) {
        const query = `
      SELECT id, gym_id, city_id, name, phone, email, status, membership_expiry, created_at 
      FROM members 
      ORDER BY created_at DESC
    `;
        return this.db.queryWithContext(query, [], context);
    }
    async create(context, data) {
        const query = `
      INSERT INTO members (gym_id, city_id, name, phone, email, status, membership_expiry)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const params = [
            data.gym_id || context.gym_id,
            data.city_id || context.city_id,
            data.name,
            data.phone,
            data.email,
            data.status || 'ACTIVE',
            data.membership_expiry
        ];
        const result = await this.db.queryWithContext(query, params, context);
        return result[0];
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MembersService);
//# sourceMappingURL=members.service.js.map