import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { TodoService } from './todo.service';
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto';
import { UpdateTodoInput, UpdateTodoOutput } from './dtos/update-todo.dto';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}
  // 할 일 상세 조회
  @Query(() => GetTodoOutput)
  getTodo(
    @AuthUser() authUser: User,
    @Args('input') getTodoInput: GetTodoInput,
  ): Promise<GetTodoOutput> {
    return this.todoService.getTodo(authUser, getTodoInput);
  }

  // 할 일 생성
  @Mutation(() => CreateTodoOutput)
  createTodo(
    @Args('input') createTodoInput: CreateTodoInput,
    @AuthUser() authUser: User,
  ): Promise<CreateTodoOutput> {
    return this.todoService.createTodo(authUser, createTodoInput);
  }

  // 할 일 수정
  @Mutation(() => UpdateTodoOutput)
  updateTodo(
    @AuthUser() authUser: User,
    @Args('input') updateTodoInput: UpdateTodoInput,
  ): Promise<UpdateTodoOutput> {
    return this.todoService.updateTodo(authUser, updateTodoInput);
  }
}
