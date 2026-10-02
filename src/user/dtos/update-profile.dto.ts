import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '@/common/dtos/output.dto';

@ObjectType()
export class UpdateProfileOutput extends PartialType(CoreOutput) {}

@InputType()
export class UpdateProfileInput extends PartialType(
  PickType(User, ['nickname', 'password', 'profileImage']),
) {}
