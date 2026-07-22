import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GraphQLContext } from './graphql-context.interface';

/* 인증 검사 */

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    return !!gqlContext.user;
  }
}
