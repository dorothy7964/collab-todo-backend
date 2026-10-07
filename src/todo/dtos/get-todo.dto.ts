import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Todo } from '../entities/todo.entity';

@InputType()
export class GetTodoInput {
  @Field(() => Int)
  todoId: number;
}

@ObjectType()
export class GetTodoOutput extends CoreOutput {
  @Field(() => Todo, { nullable: true })
  todo?: Todo;
}
