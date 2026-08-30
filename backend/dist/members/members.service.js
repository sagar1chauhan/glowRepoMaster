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
    async findOne(context, id) {
        const memberQuery = `
      SELECT id, gym_id, city_id, name, phone, email, status, membership_expiry, created_at
      FROM members
      WHERE id = $1
    `;
        const members = await this.db.queryWithContext(memberQuery, [id], context);
        if (members.length === 0)
            return null;
        const attendanceQuery = `
      SELECT id, check_in_time
      FROM attendance
      WHERE member_id = $1
      ORDER BY check_in_time DESC
      LIMIT 20
    `;
        const attendance = await this.db.queryWithContext(attendanceQuery, [id], context);
        return { ...members[0], attendance };
    }
    async create(context, data) {
        let gymId = data.gym_id || context.gym_id;
        let cityId = data.city_id || context.city_id;
        if (!gymId) {
            const gyms = await this.db.query('SELECT id, city_id FROM gyms LIMIT 1');
            if (gyms.length > 0) {
                gymId = gyms[0].id;
                cityId = cityId || gyms[0].city_id;
            }
        }
        const query = `
      INSERT INTO members (gym_id, city_id, name, phone, email, status, membership_expiry)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const params = [
            gymId,
            cityId,
            data.name,
            data.phone,
            data.email,
            data.status || 'ACTIVE',
            data.membership_expiry
        ];
        const result = await this.db.queryWithContext(query, params, context);
        return result[0];
    }
    async update(context, id, data) {
        const fields = [];
        const params = [];
        let paramIndex = 1;
        if (data.name !== undefined) {
            fields.push(`name = $${paramIndex++}`);
            params.push(data.name);
        }
        if (data.phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            params.push(data.phone);
        }
        if (data.email !== undefined) {
            fields.push(`email = $${paramIndex++}`);
            params.push(data.email);
        }
        if (data.status !== undefined) {
            fields.push(`status = $${paramIndex++}`);
            params.push(data.status);
        }
        if (data.membership_expiry !== undefined) {
            fields.push(`membership_expiry = $${paramIndex++}`);
            params.push(data.membership_expiry);
        }
        if (fields.length === 0)
            return null;
        params.push(id);
        const query = `
      UPDATE members
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
        const result = await this.db.queryWithContext(query, params, context);
        return result[0] || null;
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MembersService);
//# sourceMappingURL=members.service.js.map