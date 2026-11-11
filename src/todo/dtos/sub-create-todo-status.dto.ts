import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TodoCreatedSubscription {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  todoId: number;

  @Field(() => Int)
  categoryId: number;
}
