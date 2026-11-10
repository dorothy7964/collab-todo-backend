import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TodoStatus } from '../entities/todo.entity';

@ObjectType()
export class TodoStatusUpdatedSubscription {
  @Field(() => Int)
  todoId: number;

  @Field(() => TodoStatus)
  status: TodoStatus;

  @Field(() => Int)
  groupId: number;
}
