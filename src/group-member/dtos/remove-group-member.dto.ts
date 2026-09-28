// remove-group-member.dto.ts

import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@/common/dtos/output.dto';

@InputType()
export class RemoveGroupMemberInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  userId: number;
}

@ObjectType()
export class RemoveGroupMemberOutput extends CoreOutput {}
