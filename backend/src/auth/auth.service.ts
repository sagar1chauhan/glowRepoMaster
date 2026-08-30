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
  name?: string;
}

// Default/Demo credentials for the 3 distinct roles
const DEFAULT_USERS: Array<{
  id: string;
  email: string;
  password: string;
  role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN';
  name: string;
  city_id?: string;
  gym_id?: string;
}> = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'master@glowrep.com',
    password: 'master123',
    role: 'MASTER_ADMIN',
    name: 'Master HQ Admin',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'nodal@glowrep.com',
    password: 'nodal123',
    role: 'NODAL_MANAGER',
    name: 'Mumbai Nodal Manager',
    city_id: '11111111-1111-1111-1111-111111111111',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin@glowrep.com',
    password: 'admin123',
    role: 'GYM_ADMIN',
    name: 'Andheri Branch Admin',
    gym_id: '22222222-2222-2222-2222-222222222222',
  },
];

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly db: DatabaseService
  ) {}

  async login(email: string, pass: string) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    // 1. Try DB first
    try {
      const users = await this.db.query('SELECT * FROM admin_users WHERE LOWER(email) = $1', [normalizedEmail]);
      if (users && users.length > 0) {
        const user = users[0];
        let isMatch = false;

        if (user.password_hash) {
          try {
            isMatch = await bcrypt.compare(pass, user.password_hash);
          } catch {
            isMatch = false;
          }
          if (!isMatch && user.password_hash === pass) {
            isMatch = true;
          }
        }

        if (isMatch) {
          const payload: UserPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            city_id: user.city_id,
            gym_id: user.gym_id,
            name: user.name,
          };

          return {
            access_token: this.jwtService.sign(payload),
            user: payload,
          };
        }
      }
    } catch (err: any) {
      console.warn('DB query in AuthService fallback notice:', err?.message);
    }

    // 2. Check Default / Demo accounts fallback
    const defaultUser = DEFAULT_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (defaultUser && (defaultUser.password === pass || pass === 'admin123' || pass === 'master123' || pass === 'nodal123')) {
      const payload: UserPayload = {
        id: defaultUser.id,
        email: defaultUser.email,
        role: defaultUser.role,
        city_id: defaultUser.city_id,
        gym_id: defaultUser.gym_id,
        name: defaultUser.name,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    }

    throw new UnauthorizedException('Invalid credentials. Please check email or password.');
  }
}
