import { Args, Mutation, Resolver } from '@nestjs/graphql';
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

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

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
}
