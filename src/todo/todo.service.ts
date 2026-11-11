import { CategoryService } from '@/category/category.service';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto';
import { UpdateTodoInput, UpdateTodoOutput } from './dtos/update-todo.dto';
import { Todo, TodoSort, TodoStatus } from './entities/todo.entity';
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
import {
  GetTodosByCategoryInput,
  GetTodosByCategoryOutput,
} from './dtos/get-todos-by-category.dto';
import { GroupMemberService } from '@/group-member/group-member.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from '@/common/pubsub.constants';

@Injectable()
export class TodoService {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    @InjectRepository(Todo)
    private readonly todo: Repository<Todo>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  // Todo 목록 정렬 공통 메서드
  private applyTodoSort(
    query: SelectQueryBuilder<Todo>,
    sort: TodoSort,
  ): SelectQueryBuilder<Todo> {
    switch (sort) {
      case TodoSort.LATEST:
        query.orderBy('todo.createdAt', 'DESC');
        break;

      case TodoSort.OLDEST:
        query.orderBy('todo.createdAt', 'ASC');
        break;

      case TodoSort.PRIORITY_HIGH:
        query.orderBy(
          `CASE todo.priority
            WHEN 'HIGH' THEN 1
            WHEN 'MEDIUM' THEN 2
            WHEN 'LOW' THEN 3
            WHEN 'NONE' THEN 4
            ELSE 5
          END`,
          'ASC',
        );
        break;

      case TodoSort.PRIORITY_LOW:
        query.orderBy(
          `CASE todo.priority
            WHEN 'LOW' THEN 1
            WHEN 'MEDIUM' THEN 2
            WHEN 'HIGH' THEN 3
            WHEN 'NONE' THEN 4
            ELSE 5
          END`,
          'ASC',
        );
        break;

      case TodoSort.RECENTLY_UPDATED:
        query.orderBy('todo.updatedAt', 'DESC');
        break;

      default:
        query.orderBy('todo.createdAt', 'DESC');
        break;
    }

    return query.addOrderBy('todo.id', 'DESC');
  }

  // 할 일 상세 조회
  async getTodo(
    authUser: User,
    getTodoInput: GetTodoInput,
  ): Promise<GetTodoOutput> {
    try {
      const { todoId, groupId } = getTodoInput;

      const todo = await this.todo.findOne({
        where: {
          id: todoId,
        },
        relations: {
          category: {
            group: true,
          },
          author: true,
          assignee: true,
        },
      });

      if (!todo) {
        return {
          ok: false,
          error: '할 일을 찾을 수 없습니다.',
        };
      }

      const isGroupMember = await this.groupMemberService.findGroupMember(
        groupId,
        authUser.id,
      );
      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 조회할 수 있습니다.',
        };
      }

      return {
        ok: true,
        todo,
      };
    } catch {
      return {
        ok: false,
        error: '할 일 상세 조회에 실패했습니다.',
      };
    }
  }

  // 카테고리별 할 일 목록 조회
  async getCategoryTodos(
    authUser: User,
    getCategoryTodosInput: GetCategoryTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    try {
      const {
        categoryId,
        groupId,
        sort = TodoSort.LATEST,
      } = getCategoryTodosInput;

      // 카테고리 존재 여부 및 소속 그룹 조회
      const category = await this.categoryService.findCategoryById(categoryId);

      if (!category) {
        return {
          ok: false,
          error: '카테고리를 찾을 수 없습니다.',
        };
      }
      // 카테고리의 그룹 소속 여부 확인
      const isCategoryInGroup = category?.group.id === groupId;
      if (!isCategoryInGroup) {
        return {
          ok: false,
          error: '해당 그룹의 카테고리에서만 할 일을 조회할 수 있습니다.',
        };
      }

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.groupMemberService.findGroupMember(
        groupId,
        authUser.id,
      );

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 조회할 수 있습니다.',
        };
      }

      // 조회 쿼리 생성

      const query = this.todo
        .createQueryBuilder('todo')
        .where('todo.categoryId = :categoryId', { categoryId });

      // 정렬 기준 적용
      this.applyTodoSort(query, sort);

      // 목록 조회
      const todos = await query.getMany();

      return {
        ok: true,
        todos,
      };
    } catch {
      return {
        ok: false,
        error: '할 일 목록 조회에 실패했습니다.',
      };
    }
  }
  // 카테고리별 해야 할 일 조회
  async getTodosByCategory(
    getTodosByCategoryInput: GetTodosByCategoryInput,
  ): Promise<GetTodosByCategoryOutput> {
    try {
      const { categoryId } = getTodosByCategoryInput;
      const category = await this.categoryService.findCategoryById(categoryId);

      if (!category) {
        return {
          ok: false,
          error: '카테고리를 찾을 수 없습니다.',
        };
      }

      const todos = await this.todo.find({
        where: {
          category: {
            id: categoryId,
          },
          status: Not(TodoStatus.COMPLETED),
        },
        order: {
          updatedAt: 'DESC',
        },
      });

      if (todos.length === 0) {
        return {
          ok: false,
          error: '해야할 할 일이 없습니다.',
        };
      }

      return {
        ok: true,
        todos,
      };
    } catch {
      return {
        ok: false,
        error: '해야 할 일을 조회할 수 없습니다.',
      };
    }
  }
  // 카테고리별 완료된 할 일 조회
  async getCompletedTodos(
    getCompletedTodosInput: GetCompletedTodosInput,
  ): Promise<GetCompletedTodosOutput> {
    try {
      const { categoryId } = getCompletedTodosInput;
      const category = await this.categoryService.findCategoryById(categoryId);

      if (!category) {
        return {
          ok: false,
          error: '카테고리를 찾을 수 없습니다.',
        };
      }

      const todos = await this.todo.find({
        where: {
          category: {
            id: categoryId,
          },
          status: TodoStatus.COMPLETED,
        },
        order: {
          updatedAt: 'DESC',
        },
      });

      if (todos.length === 0) {
        return {
          ok: false,
          error: '완료된 할 일이 없습니다.',
        };
      }

      return {
        ok: true,
        todos,
      };
    } catch {
      return {
        ok: false,
        error: '완료된 할 일을 조회할 수 없습니다.',
      };
    }
  }

  // 할 일 생성
  async createTodo(
    authUser: User,
    createTodoInput: CreateTodoInput,
  ): Promise<CreateTodoOutput> {
    try {
      const { categoryId, groupId, assigneeId, ...todoData } = createTodoInput;

      const category = await this.categoryService.findCategoryById(categoryId);

      if (!category) {
        return {
          ok: false,
          error: '카테고리를 찾을 수 없습니다.',
        };
      }

      const isCategoryInGroup = category?.group.id === groupId;
      console.log(
        '📢 [todo.service.ts:325] 카테고리 그룹아이디',
        category?.group.id,
      );
      console.log('📢 [todo.service.ts:326] 작성한', groupId);
      if (!isCategoryInGroup) {
        return {
          ok: false,
          error: '해당 그룹의 카테고리에서만 할 일을 생성할 수 있습니다.',
        };
      }

      const isGroupMember = await this.groupMemberService.findGroupMember(
        groupId,
        authUser.id,
      );
      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 생성할 수 있습니다.',
        };
      }

      let assignee: User | undefined;

      if (assigneeId) {
        assignee = await this.userService.findUserById(assigneeId);

        if (!assignee) {
          return {
            ok: false,
            error: '담당자를 찾을 수 없습니다.',
          };
        }

        const isAssigneeMember = await this.groupMemberService.findGroupMember(
          groupId,
          assignee.id,
        );
        if (!isAssigneeMember) {
          return {
            ok: false,
            error: '담당자는 그룹 멤버만 지정할 수 있습니다.',
          };
        }
      }

      const newTodo = this.todo.create({
        ...todoData,
        author: authUser,
        assignee,
        category,
      });

      const todo = await this.todo.save(newTodo);

      return {
        ok: true,
        todoId: todo.id,
      };
    } catch {
      return {
        ok: false,
        error: '할 일 생성에 실패했습니다.',
      };
    }
  }

  // 할 일 수정
  async updateTodo(
    authUser: User,
    updateTodoInput: UpdateTodoInput,
  ): Promise<UpdateTodoOutput> {
    try {
      const { todoId, categoryId, assigneeId, ...updateData } = updateTodoInput;

      const todo = await this.todo.findOne({
        where: {
          id: todoId,
        },
        relations: {
          category: {
            group: true,
          },
        },
      });

      if (!todo) {
        return {
          ok: false,
          error: '할 일을 찾을 수 없습니다.',
        };
      }

      const todoGroupId = todo.category.group.id;

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.groupMemberService.findGroupMember(
        todoGroupId,
        authUser.id,
      );

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 수정할 수 있습니다.',
        };
      }

      // 카테고리 수정
      if (categoryId !== undefined) {
        const category =
          await this.categoryService.findCategoryById(categoryId);

        if (!category) {
          return {
            ok: false,
            error: '카테고리를 찾을 수 없습니다.',
          };
        }

        todo.category = category;
      }

      // 담당자 수정
      if (assigneeId !== undefined) {
        const assignee = await this.userService.findUserById(assigneeId);

        if (!assignee) {
          return {
            ok: false,
            error: '담당자를 찾을 수 없습니다.',
          };
        }

        const isAssigneeMember = await this.groupMemberService.findGroupMember(
          todoGroupId,
          assignee.id,
        );

        if (!isAssigneeMember) {
          return {
            ok: false,
            error: '담당자는 그룹 멤버만 지정할 수 있습니다.',
          };
        }

        todo.assignee = assignee;
      }

      Object.assign(todo, updateData);

      await this.todo.save(todo);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '할 일을 수정할 수 없습니다.',
      };
    }
  }

  // 할 일 상태 변경
  async updateTodoStatus(
    authUser: User,
    updateTodoStatusInput: UpdateTodoStatusInput,
  ): Promise<UpdateTodoStatusOutput> {
    try {
      // 1. 할 일 존재 여부 확인
      const { todoId, status } = updateTodoStatusInput;
      const todo = await this.todo.findOne({
        where: {
          id: todoId,
        },
        relations: {
          category: {
            group: true,
          },
        },
      });
      console.log('📢 [todo.service.ts:567]- 1 투두 조회완료', todo);

      if (!todo) {
        console.log('📢 [todo.service.ts:569] 2. 투두없음');

        return {
          ok: false,
          error: '할 일을 찾을 수 없습니다.',
        };
      }
      console.log('📢 [todo.service.ts:575] 3.투두데이터');

      const todoGroupId = todo.category.group.id;
      console.log('📢. 그룹 ID', todoGroupId);
      console.log('📢. 사용자', authUser);
      console.log('📢. 사용자 ID', authUser.id);

      // 2. 그룹 멤버 여부 확인
      const isGroupMember = await this.groupMemberService.findGroupMember(
        todoGroupId,
        authUser.id,
      );
      console.log('📢 [todo.service.ts:581] 4. 투두 카테고리', todo.category);
      console.log('📢 [todo.service.ts:581] 5. 그룹', todo.category.group.id);

      console.log('📢 [todo.service.ts:581] 6. 유저', authUser.id);
      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 수정할 수 있습니다.',
        };
      }

      // 3. 동일한 상태라면 변경하지 않음
      if (todo.status === status) {
        return {
          ok: false,
          error: '변경사항이 없습니다.',
        };
      }

      // 4. 상태 변경
      todo.status = status;

      await this.todo.save(todo);

      // 5. 상태 변경 이벤트 발생
      await this.pubSub.publish('todoStatusUpdated', {
        // Subscription 필드 이름과 일치해야 한다.
        todoStatusUpdated: {
          todoId: todo.id,
          status: todo.status,
          groupId: todoGroupId,
        },
      });
      return {
        ok: true,
      };
    } catch (e) {
      console.log('📢 [todo.service.ts:608]', e);

      return {
        ok: false,
        error: '할 일 상태를 변경할 수 없습니다.',
      };
    }
  }

  // 할 일 우선순위 변경
  async updateTodoPriority(
    authUser: User,
    updateTodoPriorityInput: UpdateTodoPriorityInput,
  ): Promise<UpdateTodoPriorityOutput> {
    try {
      const { todoId, priority } = updateTodoPriorityInput;

      // 할 일 존재 여부 확인
      const todo = await this.todo.findOne({
        where: { id: todoId },
        relations: {
          category: {
            group: true,
          },
        },
      });

      if (!todo) {
        return {
          ok: false,
          error: '할 일을 찾을 수 없습니다.',
        };
      }

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.groupMemberService.findGroupMember(
        todo.category.group.id,
        authUser.id,
      );

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일 우선순위를 변경할 수 있습니다.',
        };
      }

      // 동일한 우선순위인지 확인
      if (todo.priority === priority) {
        return {
          ok: false,
          error: '변경사항이 없습니다.',
        };
      }

      // 우선순위 변경
      todo.priority = priority;

      await this.todo.save(todo);

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: '할 일 우선순위를 변경할 수 없습니다.',
      };
    }
  }

  // 할 일 삭제
  async deleteTodo(
    authUser: User,
    deleteTodoInput: DeleteTodoInput,
  ): Promise<DeleteTodoOutput> {
    try {
      const { todoId } = deleteTodoInput;

      const todo = await this.todo.findOne({
        where: {
          id: todoId,
        },
        relations: {
          category: {
            group: true,
          },
        },
      });

      if (!todo) {
        return {
          ok: false,
          error: '할 일을 찾을 수 없습니다.',
        };
      }

      const todoGroupId = todo.category.group.id;

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.groupMemberService.findGroupMember(
        todoGroupId,
        authUser.id,
      );

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 할 일을 수정할 수 있습니다.',
        };
      }

      await this.todo.softRemove(todo);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '카테고리를 삭제할 수 없습니다.',
      };
    }
  }
}
