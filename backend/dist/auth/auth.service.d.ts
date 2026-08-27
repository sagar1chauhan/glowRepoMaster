import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
export interface UserPayload {
    id: string;
    role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN';
    city_id?: string;
    gym_id?: string;
    email: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly db;
    constructor(jwtService: JwtService, db: DatabaseService);
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: UserPayload;
    }>;
}
