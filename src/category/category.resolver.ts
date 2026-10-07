import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from './dtos/update-category.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  DeleteCategoryInput,
  DeleteCategoryOutput,
} from './dtos/delete-category.dto';
import {
  GetCategoriesInput,
  GetCategoriesOutput,
} from './dtos/get-categories.dto';
import {
  GetCategoryTodosInput,
  GetCategoryTodosOutput,
} from './dtos/get-category-todos.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  // 카테고리 상세조회
  @Query(() => CategoryOutput)
  category(
    @AuthUser() authUser: User,
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.categoryService.getCategory(authUser, categoryInput);
  }

  // 카테고리 목록조회
  @Query(() => GetCategoriesOutput)
  getCategories(
    @AuthUser() authUser: User,
    @Args('input') getCategoriesInput: GetCategoriesInput,
  ): Promise<GetCategoriesOutput> {
    return this.categoryService.getCategories(authUser, getCategoriesInput);
  }

  // 그룹 - 카테고리별 할 일 목록 조회
  @Query(() => GetCategoryTodosOutput)
  getCategoryTodos(
    @AuthUser() authUser: User,
    @Args('input') getCategoryTodosInput: GetCategoryTodosInput,
  ): Promise<GetCategoryTodosOutput> {
    return this.categoryService.getCategoryTodos(
      authUser,
      getCategoryTodosInput,
    );
  }

  // 카테고리 생성
  @Mutation(() => CreateCategoryOutput)
  async createCategory(
    @AuthUser() authUser: User,
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(authUser, createCategoryInput);
  }

  // 카테고리 수정
  @Mutation(() => UpdateCategoryOutput)
  async updateCategory(
    @AuthUser() authUser: User,
    @Args('input') updateCategoryInput: UpdateCategoryInput,
  ): Promise<UpdateCategoryOutput> {
    return this.categoryService.updateCategory(authUser, updateCategoryInput);
  }

  // 카테고리 삭제 (Hard Delete)
  @Mutation(() => DeleteCategoryOutput)
  async deleteCategory(
    @AuthUser() user: User,
    @Args('input') deleteCategoryInput: DeleteCategoryInput,
  ): Promise<DeleteCategoryOutput> {
    return this.categoryService.deleteCategory(user, deleteCategoryInput);
  }
}
