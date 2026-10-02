// 카테고리 생성
import { GroupMemberService } from '@/group-member/group-member.service';
import { GroupService } from '@/group/group.service';
import { User } from '@/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import {
  UpdateCategoryInput,
  UpdateCategoryOutput,
} from './dtos/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,

    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  // 카테고리 이름 중복 확인 (내부용)
  private async checkCategoryNameDuplicate(
    groupId: number,
    name: string,
  ): Promise<boolean> {
    const existingCategory = await this.category.findOne({
      where: {
        name,
        group: {
          id: groupId,
        },
      },
    });

    if (!existingCategory) {
      return false;
    }

    return !!existingCategory;
  }

  // 그룹 멤버 여부 확인 (내부용)
  private async checkGroupMember(
    groupId: number,
    userId: number,
  ): Promise<boolean> {
    const groupMember = await this.groupMemberService.findGroupMember(
      groupId,
      userId,
    );

    return !!groupMember;
  }

  // 카테고리 상세조회
  async getCategory(
    user: User,
    categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    try {
      const { categoryId, groupId } = categoryInput;
      const category = await this.category.findOne({
        where: { id: categoryId, group: { id: groupId } },
      });

      if (!category) {
        return { ok: false, error: '해당 카테고리를 조회할 수 없습니다.' };
      }

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.checkGroupMember(groupId, user.id);

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 카테고리를 조회할 수 있습니다.',
        };
      }

      return { ok: true, category };
    } catch {
      return { ok: false, error: '카테고리를 조회할 수 없습니다.' };
    }
  }

  // 카테고리 생성
  async createCategory(
    user: User,
    createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    try {
      const { groupId, name, categoryImage, color, sortOrder } =
        createCategoryInput;

      // 그룹 존재 여부 확인
      const group = await this.groupService.getGroupById(groupId);

      if (!group) {
        return {
          ok: false,
          error: '존재하지 않는 그룹입니다.',
        };
      }

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.checkGroupMember(groupId, user.id);

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 카테고리를 생성할 수 있습니다.',
        };
      }

      // 카테고리 이름 중복 확인
      const isCategoryNameDuplicate = await this.checkCategoryNameDuplicate(
        groupId,
        name,
      );

      if (isCategoryNameDuplicate) {
        return {
          ok: false,
          error: '이미 존재하는 카테고리 이름입니다.',
        };
      }

      // 카테고리 생성
      const category = this.category.create({
        name,
        categoryImage,
        color,
        sortOrder,
        group,
      });

      await this.category.save(category);

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

  // 카테고리 수정
  async updateCategory(
    user: User,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<UpdateCategoryOutput> {
    try {
      const { groupId, categoryId, ...updateData } = updateCategoryInput;

      // 카테고리 존재 여부 확인
      const category = await this.category.findOne({
        where: {
          id: categoryId,
          group: { id: groupId },
        },
      });

      if (!category) {
        return {
          ok: false,
          error: '존재하지 않는 카테고리입니다.',
        };
      }

      // 그룹 멤버 여부 확인
      const isGroupMember = await this.checkGroupMember(groupId, user.id);

      if (!isGroupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 카테고리를 수정할 수 있습니다.',
        };
      }

      // 이름을 수정하는 경우에만 중복 확인
      if (updateData.name !== undefined && updateData.name !== category.name) {
        const isCategoryNameDuplicate = await this.checkCategoryNameDuplicate(
          updateCategoryInput.groupId,
          updateCategoryInput.name,
        );

        if (isCategoryNameDuplicate) {
          return {
            ok: false,
            error: '이미 존재하는 카테고리 이름입니다.',
          };
        }
      }

      // 카테고리 수정
      await this.category.save([
        {
          id: categoryId,
          ...updateData,
        },
      ]);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '카테고리를 수정할 수 없습니다.',
      };
    }
  }
}
