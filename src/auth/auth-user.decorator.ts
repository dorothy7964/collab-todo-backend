import { User } from '@/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from './graphql-context.interface';

/* 로그인 사용자 추출 */

export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const gqlContext =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();

    return gqlContext.user;
  },
);
