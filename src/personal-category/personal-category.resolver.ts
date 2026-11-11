import { PersonalCategory } from '@/personal-category/entities/personal-category.entity';
import { PersonalCategoryService } from '@/personal-category/personal-category.service';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '@/auth/auth-user.decorator';
import { Role } from '@/auth/role.decorator';
import {
  CreatePersonalCategoryInput,
  CreatePersonalCategoryOutput,
} from './dtos/create-personal-category.dto';

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
  @Query(() => [PersonalCategory])
  getPersonalCategories(@AuthUser() user: User): Promise<PersonalCategory[]> {
    return this.personalCategoryService.getPersonalCategories(user.id);
  }

  // 개인 카테고리 단일 조회
  @Query(() => PersonalCategory, { nullable: true })
  getPersonalCategory(
    @AuthUser() user: User,
    @Args('id') id: number,
  ): Promise<PersonalCategory | null> {
    return this.personalCategoryService.getPersonalCategory(id, user.id);
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
