import { ArgsType, Field, ObjectType, PartialType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from '@/common/dtos/output.dto';

@ArgsType()
export class UserLookupInput {
  @Field(() => String)
  userEmail: string;
}

@ObjectType()
export class UserLookupOutput extends PartialType(CoreOutput) {
  @Field(() => User, { nullable: true })
  user?: User;
}
