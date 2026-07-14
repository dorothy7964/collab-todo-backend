import { CoreOutput } from '@/common/dtos/output.dto';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'nickname',
  'role',
  'password',
]) {}

@ObjectType()
export class CreateAccountOutput extends PartialType(CoreOutput) {}
