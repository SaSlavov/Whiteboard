import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "../auth.service";
import { jwtConstants } from "src/constant/secret";
import { JWTPayload } from "src/common/jwt-payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JWTPayload) {

    const user = await this.authService.findUserByName(payload.username);
    if (!user) {
      return;
    }
    if (user.banEndDate && user.banEndDate.valueOf() > Date.now()) {
      return;
    }
    return user;
  }
}