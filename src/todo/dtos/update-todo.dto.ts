import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CreateTodoInput } from './create-todo-dto';

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {
  @Field(() => Number)
  todoId: number;
}

@ObjectType()
export class UpdateTodoOutput extends CoreOutput {}
