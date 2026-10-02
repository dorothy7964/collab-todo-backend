import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateGroupInput } from './create-group.dto';

@InputType()
export class UpdateGroupInput extends PartialType(CreateGroupInput) {
  @Field(() => Number)
  groupId?: number;
}

@ObjectType()
export class UpdateGroupOutput extends CoreOutput {}
