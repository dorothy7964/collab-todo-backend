import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { TodoPriority } from '../entities/todo.entity';

@InputType()
export class UpdateTodoPriorityInput {
  @Field(() => Int)
  todoId: number;

  @Field(() => TodoPriority)
  @IsEnum(TodoPriority)
  priority: TodoPriority;
}

@ObjectType()
export class UpdateTodoPriorityOutput extends CoreOutput {}
