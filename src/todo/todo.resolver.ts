import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { TodoService } from './todo.service';
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto';
import { UpdateTodoInput, UpdateTodoOutput } from './dtos/update-todo.dto';
import {
  UpdateTodoStatusInput,
  UpdateTodoStatusOutput,
} from './dtos/update-todo-status.dto';
import { DeleteTodoInput, DeleteTodoOutput } from './dtos/delete-todo-dto';

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

  // 할 일 상태 변경
  @Mutation(() => UpdateTodoStatusOutput)
  updaupdateTodoStatusteTodo(
    @AuthUser() authUser: User,
    @Args('input') updateTodoStatusInput: UpdateTodoStatusInput,
  ): Promise<UpdateTodoStatusOutput> {
    return this.todoService.updaupdateTodoStatusteTodo(
      authUser,
      updateTodoStatusInput,
    );
  }

  // 카테고리 삭제 (Hard Delete)
  @Mutation(() => DeleteTodoOutput)
  deleteTodo(
    @AuthUser() authUser: User,
    @Args('input') deleteTodoInput: DeleteTodoInput,
  ): Promise<DeleteTodoOutput> {
    return this.todoService.deleteTodo(authUser, deleteTodoInput);
  }
}
