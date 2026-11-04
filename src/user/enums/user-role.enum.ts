import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '유저 타입',
  valuesMap: {
    ADMIN: { description: '관리자' },
    USER: { description: '회원' },
  },
});
