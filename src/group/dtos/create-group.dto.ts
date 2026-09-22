import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Group } from '../entities/group.entity';

@InputType()
export class CreateGroupInput extends PickType(Group, [
  'name',
  'description',
  'groupImage',
  'isPublic',
]) {}

@ObjectType()
export class CreateGroupOutput extends PartialType(CoreOutput) {
  @Field(() => Int, { nullable: true })
  groupId?: number;
}
