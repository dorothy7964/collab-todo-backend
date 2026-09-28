import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class InviteGroupMemberInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  userId: number;
}

@ObjectType()
export class InviteGroupMemberOutput extends CoreOutput {}
