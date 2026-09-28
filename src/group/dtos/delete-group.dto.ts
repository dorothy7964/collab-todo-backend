import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteGroupInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class DeleteGroupOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  groupId?: number;
}
