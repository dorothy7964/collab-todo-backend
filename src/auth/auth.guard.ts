import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GraphQLContext } from './graphql-context.interface';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';

/* 인증 검사 */

@Injectable()
export class AuthGuard implements CanActivate {
  // metadata를 get하기 위해 reflector class를 get해야한다.
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 보통 target은 context.getHandler() 이다.
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );

    // @Role 데코레이터가 정의되지 않은 경우, 누구든지 접근 허용
    const PUBLIC_USER = !roles;
    if (PUBLIC_USER) {
      return true;
    }

    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();

    const user = gqlContext['user'];
    if (!user) {
      return false;
    }

    // 로그인한 유저이고 role이 뭐든 접근 가능
    const USER_ROLE_ALL = roles.includes('Any');
    if (USER_ROLE_ALL) {
      return true;
    }
    return roles.includes(user.role);
  }
}
