import { GroupMemberRole } from '@/group-member/entities/group-member.entity';
import { GroupMemberService } from '@/group-member/group-member.service';
import { User } from '@/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { DeleteGroupInput, DeleteGroupOutput } from './dtos/delete-group.dto';
import { GroupInput, GroupOutput } from './dtos/group.dto';
import { MyGroupsOutput } from './dtos/my-groups.dto';
import { Group } from './entities/group.entity';
import { UpdateGroupInput, UpdateGroupOutput } from './dtos/update-group-dto';

export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>,
    private readonly groupMemberService: GroupMemberService,
  ) {}
  getAll(): Promise<Group[]> {
    return this.group.find();
  }

  // 그룹 ID로 그룹 조회 (Service 내부 사용)
  async getGroupById(groupId: number): Promise<Group | null> {
    return this.group.findOne({
      where: { id: groupId },
    });
  }

  // 그룹 상세 조회
  async findGroupById({ groupId }: GroupInput): Promise<GroupOutput> {
    try {
      const group = await this.getGroupById(groupId);

      if (!group) {
        return {
          ok: false,
          error: '그룹 정보를 찾을 수 없습니다.',
        };
      }
      return {
        ok: true,
        group,
      };
    } catch {
      return {
        ok: false,
        error: '그룹 정보를 찾을 수 없습니다.',
      };
    }
  }

  // 그룹 목록 조회
  async getMyGroups(owner: User): Promise<MyGroupsOutput> {
    try {
      const groups = await this.group.find({
        where: { owner: { id: owner.id } },
      });
      return {
        ok: true,
        groups,
      };
    } catch {
      return {
        ok: false,
        error: '그룹을 찾을 수 없습니다.',
      };
    }
  }

  // 그룹 생성
  async createGroup(
    owner: User,
    createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    try {
      const { name, description, groupImage, isPublic } = createGroupInput;
      const groupExists = await this.group.findOne({
        where: { name },
      });
      if (groupExists) {
        return {
          ok: false,
          error: '해당 이름의 그룹이 이미 있습니다.',
        };
      }

      const newGroup = this.group.create({
        name,
        description,
        groupImage,
        isPublic,
      });
      newGroup.owner = owner;
      await this.group.save(newGroup);

      // 그룹 생성자를 멤버로 추가
      await this.groupMemberService.saveGroupMember(
        owner,
        newGroup,
        GroupMemberRole.OWNER,
      );

      return { ok: true, groupId: newGroup.id };
    } catch {
      return {
        ok: false,
        error: '그룹을 만들 수 없습니다.',
      };
    }
  }

  // 그룹 수정
  async updateGroup(
    owner: User,
    updateGroupInput: UpdateGroupInput,
  ): Promise<UpdateGroupOutput> {
    try {
      const group = await this.getGroupById(updateGroupInput.groupId);

      if (!group) {
        return {
          ok: false,
          error: '그룹을 수정할 수 없습니다.',
        };
      }

      const isNotAuthorizedOwner = owner.id !== group.ownerId;
      if (isNotAuthorizedOwner) {
        return {
          ok: false,
          error: '그룹장만 수정할 수 있습니다.',
        };
      }

      await this.group.save([
        {
          id: updateGroupInput.groupId,
          ...updateGroupInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '그룹을 수정할 수 없습니다.',
      };
    }
  }

  // 그룹 삭제
  async deleteGroup(
    owner: User,
    deleteGroupInput: DeleteGroupInput,
  ): Promise<DeleteGroupOutput> {
    try {
      const group = await this.getGroupById(deleteGroupInput.groupId);

      if (!group) {
        return {
          ok: false,
          error: '존재하지 않는 그룹입니다.',
        };
      }

      if (owner.id !== group.ownerId) {
        return {
          ok: false,
          error: '그룹장만 그룹을 삭제할 수 있습니다.',
        };
      }

      await this.group.softRemove(group);

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: '그룹 삭제를 할 수 없습니다.',
      };
    }
  }
}
