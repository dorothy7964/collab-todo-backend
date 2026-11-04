import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Todo } from '../entities/todo.entity';

@InputType()
export class GetTodosByCategoryInput {
  @Field(() => Number)
  categoryId: number;
}

@ObjectType()
export class GetTodosByCategoryOutput extends CoreOutput {
  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
