import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  /**
   * The decoded JWT payload is automatically passed here.
   * The returned object is attached to request.user.
   */
  async validate(payload: UserPayload): Promise<UserPayload> {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      city_id: payload.city_id,
      gym_id: payload.gym_id,
    };
  }
}
