import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        pass: string;
    }): Promise<{
        access_token: string;
        user: import("./auth.service").UserPayload;
    }>;
    getProfile(req: any): any;
}
