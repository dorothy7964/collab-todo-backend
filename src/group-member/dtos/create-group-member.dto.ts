import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { GroupMember } from '../entities/group-member.entity';

@InputType()
export class CreateGroupMemberInput extends PartialType(GroupMember) {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class CreateGroupMemberOutput extends CoreOutput {}
