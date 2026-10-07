import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '@/category/category.service';
import { CreateTodoInput, CreateTodoOutput } from './dtos/create-todo-dto';
import { Todo } from './entities/todo.entity';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todo: Repository<Todo>,

    private readonly categoryService: CategoryService,
  ) {}

  async createTodo(
    user: User,
    createTodoInput: CreateTodoInput,
  ): Promise<CreateTodoOutput> {
    try {
      const { categoryId, groupId, ...todoData } = createTodoInput;

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

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.categoryService.checkGroupMember(
        groupId,
        user.id,
      );
      console.log('📢 [todo.service.ts:42]', isGroupMember);

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 카테고리를 생성할 수 있습니다.',
        };
      }

      const newTodo = this.todo.create({
        ...todoData,
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
}
