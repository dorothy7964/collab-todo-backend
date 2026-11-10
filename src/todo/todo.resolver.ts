import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
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
import { PUB_SUB } from '@/common/pubsub.constants';
import { Role } from '@/auth/role.decorator';
import { Todo } from './entities/todo.entity';
import { TodoStatusUpdatedSubscription } from './dtos/sub-update-todo-status.dto';

@Resolver(() => Todo)
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

  /* 할일 상태 구독 */
  @Subscription(() => TodoStatusUpdatedSubscription, {
    filter: (
      payload: { todoStatusUpdated: TodoStatusUpdatedSubscription },
      variables: { groupId: number },
    ) => {
      return payload.todoStatusUpdated.groupId === variables.groupId;
    },
    resolve: (payload: {
      todoStatusUpdated: TodoStatusUpdatedSubscription;
    }) => {
      return payload.todoStatusUpdated;
    },
  })
  todoStatusUpdated(@Args('groupId', { type: () => Int }) groupId: number) {
    console.log('📢 [todo.resolver.ts:88]', groupId);
    return this.pubSub.asyncIterableIterator('todoStatusUpdated');
  }

  // 할 일 상세 조회
  @Role(['Any'])
  @Query(() => GetTodoOutput)
  getTodo(
    @AuthUser() authUser: User,
    @Args('input') getTodoInput: GetTodoInput,
  ): Promise<GetTodoOutput> {
    return this.todoService.getTodo(authUser, getTodoInput);
  }

  // 카테고리별 할 일 목록 조회
  @Role(['Any'])
  @Query(() => GetCategoryTodosOutput)
  getCategoryTodos(
    @AuthUser() authUser: User,
    @Args('input') getCategoryTodosInput: GetCategoryTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getCategoryTodos(authUser, getCategoryTodosInput);
  }

  // 카테고리별 해야 할 일 조회
  @Role(['Any'])
  @Query(() => GetTodosByCategoryOutput)
  getTodosByCategory(
    @Args('input') getTodosByCategoryInput: GetTodosByCategoryInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getTodosByCategory(getTodosByCategoryInput);
  }

  // 카테고리별 완료된 할 일 조회
  @Role(['Any'])
  @Query(() => GetCompletedTodosOutput)
  getCompletedTodos(
    @Args('input') getCompletedTodosInput: GetCompletedTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.todoService.getCompletedTodos(getCompletedTodosInput);
  }

  // 할 일 생성
  @Role(['USER'])
  @Mutation(() => CreateTodoOutput)
  createTodo(
    @Args('input') createTodoInput: CreateTodoInput,
    @AuthUser() authUser: User,
  ): Promise<CreateTodoOutput> {
    return this.todoService.createTodo(authUser, createTodoInput);
  }

  // 할 일 수정
  @Role(['USER'])
  @Mutation(() => UpdateTodoOutput)
  updateTodo(
    @AuthUser() authUser: User,
    @Args('input') updateTodoInput: UpdateTodoInput,
  ): Promise<UpdateTodoOutput> {
    return this.todoService.updateTodo(authUser, updateTodoInput);
  }

  // 할 일 상태 변경
  @Role(['USER'])
  @Mutation(() => UpdateTodoStatusOutput)
  updateTodoStatus(
    @AuthUser() authUser: User,
    @Args('input') updateTodoStatusInput: UpdateTodoStatusInput,
  ): Promise<UpdateTodoStatusOutput> {
    console.log('📢 [todo.resolver.ts:168]', authUser);

    return this.todoService.updateTodoStatus(authUser, updateTodoStatusInput);
  }

  // 할 일 우선순위 변경
  @Role(['USER'])
  @Mutation(() => UpdateTodoPriorityOutput)
  updateTodoPriority(
    @AuthUser() authUser: User,
    @Args('input') input: UpdateTodoPriorityInput,
  ): Promise<UpdateTodoPriorityOutput> {
    return this.todoService.updateTodoPriority(authUser, input);
  }

  // 카테고리 삭제 (Hard Delete)
  @Role(['USER'])
  @Mutation(() => DeleteTodoOutput)
  deleteTodo(
    @AuthUser() authUser: User,
    @Args('input') deleteTodoInput: DeleteTodoInput,
  ): Promise<DeleteTodoOutput> {
    return this.todoService.deleteTodo(authUser, deleteTodoInput);
  }
}
