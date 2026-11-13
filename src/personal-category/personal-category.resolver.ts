import { AuthUser } from '@/auth/auth-user.decorator';
import { Role } from '@/auth/role.decorator';
import { PersonalCategory } from '@/personal-category/entities/personal-category.entity';
import { PersonalCategoryService } from '@/personal-category/personal-category.service';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreatePersonalCategoryInput,
  CreatePersonalCategoryOutput,
} from './dtos/create-personal-category.dto';
import { GetPersonalCategoriesOutput } from './dtos/get-personal-categories.dto';
import {
  GetPersonalCategoryInput,
  GetPersonalCategoryOutput,
} from './dtos/get-personal-category.dto';

@Resolver(() => PersonalCategory)
export class PersonalCategoryResolver {
  constructor(
    private readonly personalCategoryService: PersonalCategoryService,
  ) {}

  // 개인 카테고리 생성
  @Role(['USER'])
  @Mutation(() => CreatePersonalCategoryOutput)
  async createPersonalCategory(
    @AuthUser() authUser: User,
    @Args('input') createPersonalCategoryInput: CreatePersonalCategoryInput,
  ): Promise<CreatePersonalCategoryOutput> {
    return this.personalCategoryService.createPersonalCategory(
      authUser,
      createPersonalCategoryInput,
    );
  }

  // 개인 카테고리 목록 조회
  @Role(['USER'])
  @Query(() => GetPersonalCategoriesOutput)
  async getPersonalCategories(
    @AuthUser() authUser: User,
  ): Promise<GetPersonalCategoriesOutput> {
    return this.personalCategoryService.getPersonalCategories(authUser);
  }

  // 개인 카테고리 단일 조회
  @Role(['USER'])
  @Query(() => GetPersonalCategoryOutput)
  async getPersonalCategory(
    @AuthUser() authUser: User,
    @Args('input') getPersonalCategoryInput: GetPersonalCategoryInput,
  ): Promise<GetPersonalCategoryOutput> {
    return this.personalCategoryService.getPersonalCategory(
      authUser,
      getPersonalCategoryInput,
    );
  }

  // 개인 카테고리 수정
  @Mutation(() => Boolean)
  async updatePersonalCategory(
    @AuthUser() user: User,
    @Args('id') id: number,
    @Args('name') name: string,
  ): Promise<boolean> {
    await this.personalCategoryService.updatePersonalCategory(
      id,
      user.id,
      name,
    );

    return true;
  }

  // 개인 카테고리 삭제
  @Mutation(() => Boolean)
  async deletePersonalCategory(
    @AuthUser() user: User,
    @Args('id') id: number,
  ): Promise<boolean> {
    await this.personalCategoryService.deletePersonalCategory(id, user.id);

    return true;
  }
}
