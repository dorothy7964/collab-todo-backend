import { CoreOutput } from '@/common/dtos/output.dto';
import { Todo } from '@/todo/entities/todo.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class GetCategoryTodosInput {
  @Field(() => Int)
  categoryId: number;
}

@ObjectType()
export class GetCategoryTodosOutput extends CoreOutput {
  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
