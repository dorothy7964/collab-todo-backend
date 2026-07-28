import { UserRole } from '@/user/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

// keyof typeof UserRole : UserRole enum의 키만 사용할 수 있다.
export type AllowedRoles = keyof typeof UserRole | 'Any';

// SetMetadata로 roles라는 Metadata를 생성한다.
// @Role() 데코레이터를 통해 필요한 권한을 지정한다.
// AuthGuard가 Metadata를 읽어 사용자의 역할을 검사한다.
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
