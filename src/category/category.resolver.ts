import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

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
}
