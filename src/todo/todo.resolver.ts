import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { DeleteTodoInput, DeleteTodoOutput } from './dtos/delete-todo-dto';
import {
  GetCategoryTodosInput,
  GetCategoryTodosOutput,
} from './dtos/get-category-todos.dto';
import {
  GetCompletedTodosInput,
  GetCompletedTodosOutput,
} from './dtos/get-completed-todos-dto';
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto';
import {
  GetTodosByCategoryInput,
  GetTodosByCategoryOutput,
} from './dtos/get-todos-by-category.dto';
import {
  UpdateTodoPriorityInput,
  UpdateTodoPriorityOutput,
} from './dtos/update-todo-priority.dto';
import {
  UpdateTodoStatusInput,
  UpdateTodoStatusOutput,
} from './dtos/update-todo-status.dto';
import { UpdateTodoInput, UpdateTodoOutput } from './dtos/update-todo.dto';
import { TodoService } from './todo.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '@/common/common.constants';
import { Role } from '@/auth/role.decorator';

@Resolver()
export class TodoResolver {
  constructor(
    private readonly todoService: TodoService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  /* 이벤트 발행*/
  // publish() : 지정한 이벤트 이름으로 데이터를 발행한다.
  @Mutation(() => Boolean)
  async ReadyTest(@Args('subId') subId: number) {
    await this.pubSub.publish('todoTestSub', {
      testSubscription: subId,
    });
    return true;
  }

  /* 이벤트 구독*/
  @Subscription(() => String, {
    filter: ({ testSubscription }, { subId }) => {
      return testSubscription === subId;
    },
  })
  @Role(['Any'])
  testSubscription(@Args('subId') subId: number) {
    // asyncIterator() : 지정한 이벤트를 구독하고 새로운 데이터가 발행되면 전달받는다.
    console.log('📢 [todo.resolver.ts:63]', subId);
    return this.pubSub.asyncIterableIterator('todoTestSub');
  }

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

  // 카테고리별 해야 할 일 조회
  @Query(() => GetTodosByCategoryOutput)
  getTodosByCategory(
    @Args('input') getTodosByCategoryInput: GetTodosByCategoryInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getTodosByCategory(getTodosByCategoryInput);
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
