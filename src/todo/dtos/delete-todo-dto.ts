import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteTodoInput {
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  groupId?: number;

  @Field(() => Int)
  todoId: number;
}

@ObjectType()
export class DeleteTodoOutput extends CoreOutput {}
