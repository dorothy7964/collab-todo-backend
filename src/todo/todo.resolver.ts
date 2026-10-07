import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => CreateTodoOutput)
  createTodo(
    @Args('input') createTodoInput: CreateTodoInput,
    @AuthUser() authUser: User,
  ): Promise<CreateTodoOutput> {
    return this.todoService.createTodo(authUser, createTodoInput);
  }
}
