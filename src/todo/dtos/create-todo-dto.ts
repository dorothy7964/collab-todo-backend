import { CoreOutput } from '@/common/dtos/output.dto';
import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { Todo, TodoPriority, TodoStatus } from '../entities/todo.entity';

@InputType()
export class CreateTodoInput extends PickType(Todo, [
  'title',
  'memo',
  'place',
  'latitude',
  'longitude',
]) {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  assigneeId?: number;

  @Field(() => TodoStatus, {
    nullable: true,
    defaultValue: TodoStatus.TODO,
  })
  status?: TodoStatus;

  @Field(() => TodoPriority, {
    nullable: true,
    defaultValue: TodoPriority.NONE,
  })
  priority?: TodoPriority;
}

@ObjectType()
export class CreateTodoOutput extends PartialType(CoreOutput) {
  @Field(() => Int, { nullable: true })
  todoId?: number;
}
