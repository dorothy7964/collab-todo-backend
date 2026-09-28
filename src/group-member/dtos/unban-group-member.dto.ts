// unban-group-member.dto.ts

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@/common/dtos/output.dto';

@InputType()
export class UnbanGroupMemberInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  userId: number;
}

@ObjectType()
export class UnbanGroupMemberOutput extends CoreOutput {}
