import { CategoryService } from '@/category/category.service';
import { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { GetTodoInput, GetTodoOutput } from './dtos/get-todo.dto';
import { UpdateTodoInput, UpdateTodoOutput } from './dtos/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todo: Repository<Todo>,

    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  // 할 일 상세 조회
  async getTodo(
    authUser: User,
    getTodoInput: GetTodoInput,
  ): Promise<GetTodoOutput> {
    try {
      const { todoId } = getTodoInput;

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

      const isGroupMember = await this.categoryService.checkGroupMember(
        todo.category.group.id,
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

  // 할 일 생성
  async createTodo(
    authUser: User,
    createTodoInput: CreateTodoInput,
  ): Promise<CreateTodoOutput> {
    try {
      const { categoryId, groupId, assigneeId, ...todoData } = createTodoInput;

      const category = await this.categoryService.findCategoryById(
        categoryId,
        groupId,
      );

      if (!category) {
        return {
          ok: false,
          error: '카테고리를 찾을 수 없습니다.',
        };
      }

      const isGroupMember = await this.categoryService.checkGroupMember(
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

        const isAssigneeMember = await this.categoryService.checkGroupMember(
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
      const isGroupMember = await this.categoryService.checkGroupMember(
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
        const category = await this.categoryService.findCategoryById(
          categoryId,
          todoGroupId,
        );

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

        const isAssigneeMember = await this.categoryService.checkGroupMember(
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
}
