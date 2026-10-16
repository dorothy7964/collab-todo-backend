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
import {
  GetCategoryTodosInput,
  GetCategoryTodosOutput,
} from './dtos/get-category-todos.dto';
import {
  UpdateTodoPriorityInput,
  UpdateTodoPriorityOutput,
} from './dtos/update-todo-priority.dto';
import {
  GetCompletedTodosInput,
  GetCompletedTodosOutput,
} from './dtos/get-completed-todos-dto';

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

  // 카테고리별 할 일 목록 조회
  @Query(() => GetCategoryTodosOutput)
  getCategoryTodos(
    @AuthUser() authUser: User,
    @Args('input') getCategoryTodosInput: GetCategoryTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getCategoryTodos(authUser, getCategoryTodosInput);
  }

  // 카테고리별 완료된 할 일 조회
  @Query(() => GetCompletedTodosOutput)
  getCompletedTodos(
    @Args('input') getCompletedTodosInput: GetCompletedTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getCompletedTodos(getCompletedTodosInput);
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

  // 할 일 우선순위 변경
  @Mutation(() => UpdateTodoPriorityOutput)
  updateTodoPriority(
    @AuthUser() authUser: User,
    @Args('input') input: UpdateTodoPriorityInput,
  ): Promise<UpdateTodoPriorityOutput> {
    return this.todoService.updateTodoPriority(authUser, input);
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
