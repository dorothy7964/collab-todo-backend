import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'nickname',
  'role',
  'password',
]) {
  @Field(() => String, { nullable: true })
  profileImage?: string;
}

@ObjectType()
export class CreateAccountOutput extends PartialType(CoreOutput) {}
