import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Group } from '../entities/group.entity';

@InputType()
export class GroupInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class GroupOutput extends CoreOutput {
  @Field(() => Group, { nullable: true })
  group?: Group;
}
