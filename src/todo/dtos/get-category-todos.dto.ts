import { CoreOutput } from '@/common/dtos/output.dto';
import { Todo, TodoSort } from '@/todo/entities/todo.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetCategoryTodosInput {
  @Field(() => Int)
  groupId: number;

  @Field(() => Int)
  categoryId: number;

  @Field(() => TodoSort, {
    nullable: true,
    defaultValue: TodoSort.LATEST,
  })
  sort?: TodoSort;
}

@ObjectType()
export class GetCategoryTodosOutput extends CoreOutput {
  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
