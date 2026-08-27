import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

export interface UserPayload {
  id: string;
  role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN';
  city_id?: string;
  gym_id?: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService
  ) {}

  async login(email: string, pass: string) {
    const users = await this.db.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      city_id: user.city_id,
      gym_id: user.gym_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
