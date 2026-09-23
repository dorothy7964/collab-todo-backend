import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GroupMember } from '../entities/group-member.entity';

@InputType()
export class GetGroupMembersInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class GetGroupMembersOutput extends CoreOutput {
  @Field(() => [GroupMember], { nullable: true })
  groupMembers?: GroupMember[];
}
