import { User } from '@/user/entities/user.entity';

/* Context 공통 타입 */

export interface GraphQLContext {
  user?: User;
}
