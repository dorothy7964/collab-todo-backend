import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '@/common/dtos/output.dto';

@InputType()
export class LeaveGroupInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class LeaveGroupOutput extends CoreOutput {}
