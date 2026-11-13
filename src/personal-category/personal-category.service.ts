import { PersonalCategory } from '@/personal-category/entities/personal-category.entity';
import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePersonalCategoryInput,
  CreatePersonalCategoryOutput,
} from './dtos/create-personal-category.dto';
import { GetPersonalCategoriesOutput } from './dtos/get-personal-categories.dto';
import {
  GetPersonalCategoryInput,
  GetPersonalCategoryOutput,
} from './dtos/get-personal-category.dto';
import {
  UpdatePersonalCategoryInput,
  UpdatePersonalCategoryOutput,
} from './dtos/update-personal-category.dto';

@Injectable()
export class PersonalCategoryService {
  constructor(
    @InjectRepository(PersonalCategory)
    private readonly personalCategory: Repository<PersonalCategory>,
  ) {}

  // 개인 카테고리 존재 여부 및 그룹 소속 확인 (내부용)
  async findPersonalCategoryById(
    categoryId: number,
  ): Promise<PersonalCategory | null> {
    return this.personalCategory.findOne({
      where: {
        id: categoryId,
      },
    });
  }

  // 개인 해당 카테고리 목록 조회 (내부용)
  async findPersonalCategories(
    userId: number,
  ): Promise<PersonalCategory[] | null> {
    return this.personalCategory.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  // 개인 해당 카테고리 조회 (내부용)
  async findPersonalCategory(
    categoryId: number,
    userId: number,
  ): Promise<PersonalCategory | null> {
    return this.personalCategory.findOne({
      where: {
        id: categoryId,
        user: {
          id: userId,
        },
      },
    });
  }

  // 개인 카테고리 이름 중복 확인 (내부용)
  private async checkPersonalCategoryNameDuplicate(
    name: string,
    userId: number,
  ): Promise<boolean> {
    const existingCategory = await this.personalCategory.findOne({
      where: {
        name,
        user: {
          id: userId,
        },
      },
    });

    if (!existingCategory) {
      return false;
    }

    return !!existingCategory;
  }

  // 개인 카테고리 생성
  async createPersonalCategory(
    user: User,
    createPersonalCategoryInput: CreatePersonalCategoryInput,
  ): Promise<CreatePersonalCategoryOutput> {
    try {
      const { name, categoryImage, color, sortOrder } =
        createPersonalCategoryInput;

      // 카테고리 이름 중복 확인
      const isPersonalCategoryNameDuplicate =
        await this.checkPersonalCategoryNameDuplicate(name, user.id);

      if (isPersonalCategoryNameDuplicate) {
        return {
          ok: false,
          error: '이미 존재하는 카테고리 이름입니다.',
        };
      }

      // 카테고리 생성
      const category = this.personalCategory.create({
        name,
        categoryImage,
        color,
        sortOrder,
        user,
      });

      await this.personalCategory.save(category);

      return {
        ok: true,
        categoryId: category.id,
      };
    } catch {
      return {
        ok: false,
        error: '카테고리 생성에 실패했습니다.',
      };
    }
  }

  // 개인 카테고리 목록 조회
  async getPersonalCategories(
    user: User,
  ): Promise<GetPersonalCategoriesOutput> {
    try {
      const personalCategories = await this.findPersonalCategories(user.id);
      if (!personalCategories || personalCategories.length === 0) {
        return {
          ok: false,
          error: '해당 개인 케테고리 목록이 없습니다',
        };
      }

      return {
        ok: true,
        personalCategories,
      };
    } catch {
      return { ok: false, error: '카테고리 목록을 조회할 수 없습니다.' };
    }
  }

  // 개인 카테고리 단일 조회
  async getPersonalCategory(
    user: User,
    getPersonalCategoryInput: GetPersonalCategoryInput,
  ): Promise<GetPersonalCategoryOutput> {
    try {
      const { categoryId } = getPersonalCategoryInput;
      const personalCategory = await this.findPersonalCategory(
        user.id,
        categoryId,
      );
      if (!personalCategory) {
        return {
          ok: false,
          error: '해당 개인 케테고리 목록이 없습니다',
        };
      }

      return {
        ok: true,
        personalCategory,
      };
    } catch {
      return { ok: false, error: '카테고리 목록을 조회할 수 없습니다.' };
    }
  }

  // 개인 카테고리 수정
  async updatePersonalCategory(
    user: User,
    updatePersonalCategoryInput: UpdatePersonalCategoryInput,
  ): Promise<UpdatePersonalCategoryOutput> {
    try {
      const { categoryId, ...updateData } = updatePersonalCategoryInput;
      const personalCategory = await this.findPersonalCategory(
        user.id,
        categoryId,
      );
      if (!personalCategory) {
        return {
          ok: false,
          error: '해당 개인 케테고리 목록이 없습니다',
        };
      }

      // 이름을 수정하는 경우에만 중복 확인
      if (
        updateData.name !== undefined &&
        updateData.name !== personalCategory.name
      ) {
        const isPersonalCategoryNameDuplicate =
          await this.checkPersonalCategoryNameDuplicate(
            updateData.name,
            user.id,
          );

        if (isPersonalCategoryNameDuplicate) {
          return {
            ok: false,
            error: '이미 존재하는 카테고리 이름입니다.',
          };
        }
      }

      await this.personalCategory.save([
        {
          id: categoryId,
          ...updateData,
        },
      ]);

      return {
        ok: true,
      };
    } catch {
      return { ok: false, error: '카테고리를 수정할 수 없습니다.' };
    }
  }

  // // 개인 카테고리 삭제
  // async deletePersonalCategory(id: number, userId: number): Promise<void> {
  //   await this.personalCategory.softDelete({
  //     id,
  //     user: { id: userId },
  //   });
  // }
}
