import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Todo } from '../entities/todo.entity';

@InputType()
export class GetCompletedTodosInput {
  @Field(() => Number)
  categoryId: number;
}

@ObjectType()
export class GetCompletedTodosOutput extends CoreOutput {
  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
