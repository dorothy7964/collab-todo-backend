import { ArgsType, Field, ObjectType, PartialType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '@/common/dtos/output.dto';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends PartialType(CoreOutput) {
  @Field(() => User, { nullable: true })
  user?: User;
}
