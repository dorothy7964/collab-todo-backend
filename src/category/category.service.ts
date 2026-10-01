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
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly category: Repository<Category>,

    private readonly groupService: GroupService,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  // 카테고리 생성
  async createCategory(
    user: User,
    createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    try {
      const { groupId } = createCategoryInput;

      // 그룹 존재 여부 확인
      const group = await this.groupService.getGroupById(groupId);

      if (!group) {
        return {
          ok: false,
          error: '존재하지 않는 그룹입니다.',
        };
      }

      // 그룹 멤버 여부 확인
      const groupMember = await this.groupMemberService.findGroupMember(
        groupId,
        user.id,
      );

      if (!groupMember) {
        return {
          ok: false,
          error: '그룹 멤버만 카테고리를 생성할 수 있습니다.',
        };
      }

      // 카테고리 이름 중복 확인
      const existingCategory = await this.category.findOne({
        where: {
          name: createCategoryInput.name,
          group: { id: groupId },
        },
      });

      if (existingCategory) {
        return {
          ok: false,
          error: '이미 존재하는 카테고리 이름입니다.',
        };
      }

      // 카테고리 생성
      const category = this.category.create({
        name: createCategoryInput.name,
        color: createCategoryInput.color,
        sortOrder: createCategoryInput.sortOrder ?? 0,
        categoryImage: createCategoryInput.categoryImage,
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
}
