import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Todo } from '../entities/todo.entity';

@InputType()
export class UpdateTodoStatusInput extends PickType(Todo, [`status`]) {
  @Field(() => Int)
  todoId: number;
}

@ObjectType()
export class UpdateTodoStatusOutput extends PartialType(CoreOutput) {}
