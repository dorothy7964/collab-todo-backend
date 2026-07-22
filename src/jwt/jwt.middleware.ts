import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from './jwt.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      // 1. 토큰 저장/ request headers안에 token을 가져오기
      const token = req.headers['x-jwt'];

      try {
        // 2. 토큰 암호 해독 / 가져온 token을 jwt.verify()를 이용해서 토큰을 검증하고 payload를 반환
        const decoded = this.jwtService.verify(token.toString());

        if (
          typeof decoded === 'object' &&
          decoded !== null &&
          Object.hasOwn(decoded, 'id')
        ) {
          // 3. 유저 찾기 / 반환한 payload를 이용해서 유저를 찾는다.
          const { user } = await this.userService.findById(decoded['id']);

          // 4.  graphQL로 request를 공유 / 유저를 찾았다면 찾은 유저의 정보를 req에 다시 넣어 다음 미들웨어에 전달한다.
          req['user'] = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
