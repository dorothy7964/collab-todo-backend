import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      provide: APP_GUARD, // APP_GUARD : Guard를 전역(Global) 으로 등록하기 위한 토큰
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}

// 동작 과정
// 1. AuthModule이 애플리케이션에 등록된다.
// 2. APP_GUARD에 AuthGuard를 연결한다.
// 3. NestJS가 모든 GraphQL 요청이 들어올 때마다 AuthGuard를 자동으로 실행한다.
// 4. AuthGuard에서 JWT 검증, 사용자 정보 확인 등의 인증을 수행한다.
