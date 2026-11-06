import { JwtService } from '@/jwt/jwt.service';
import { UserService } from '@/user/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './role.decorator';
import { User } from '@/user/entities/user.entity';

interface GraphQLContext {
  token?: string;
  user?: User;
}

/* 인증 및 인가 검사 */

@Injectable()
export class AuthGuard implements CanActivate {
  // metadata를 get하기 위해 reflector class를 get해야한다.
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // @Role 데코레이터의 메타데이터 조회
    const roles = this.reflector.getAllAndOverride<AllowedRoles>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // @Role 데코레이터가 정의되지 않은 경우, 누구든지 접근 허용
    const PUBLIC_USER = !roles;
    if (PUBLIC_USER) {
      return true;
    }

    // GraphQL Context 가져오기
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    // GraphQL 컨텍스트로 변환
    const { token } = gqlContext;

    // 토큰이 없는 경우 접근 거부
    if (!token) {
      return false;
    }

    // jwt 인증 처리
    try {
      // 토큰 암호 해독(JWT 검증 및 Payload 반환) / 가져온 token을 jwt.verify()를 이용해서 토큰을 검증하고 payload를 반환
      const decoded = this.jwtService.verify(token.toString());

      // Payload에 id가 있는지 확인
      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        Object.prototype.hasOwnProperty.call(decoded, 'id')
      ) {
        // 사용자 정보 조회
        const { user } = await this.userService.findById(decoded['id']);
        if (!user) {
          return false;
        }

        // 유저 정보 저장 : GraphQL Context에 사용자 정보 저장
        gqlContext.user = user;

        // @Role에 "Any"가 포함된 경우, 모든 사용자 접근 허용
        if (roles.includes('Any')) {
          return true;
        }

        // 유저의 역할이 @Role에 포함되어 있는지 확인
        return roles.includes(user.role);
      }
    } catch (e) {
      console.log(e);
      return false;
    }

    return false;
  }
}
