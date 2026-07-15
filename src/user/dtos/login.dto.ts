import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '@/common/dtos/output.dto';

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends PartialType(CoreOutput) {
  @Field(() => String, { nullable: true })
  token?: string;
}
