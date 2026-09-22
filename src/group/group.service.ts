import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { User } from '@/user/entities/user.entity';
import { MyGroupsOutput } from './dtos/my-groups.dto';
import { GroupInput, GroupOutput } from './dtos/group.dto';
import { EditGroupInput, EditGroupOutput } from './dtos/edit-group-dto';

export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>,
  ) {}
  getAll(): Promise<Group[]> {
    return this.group.find();
  }

  // 그룹 상세 조회
  async findGroupById({ groupId }: GroupInput): Promise<GroupOutput> {
    try {
      const group = await this.group.findOne({
        where: { id: groupId },
      });
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

  async createGroup(
    owner: User,
    createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    try {
      const { name, description, groupImage } = createGroupInput;
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
        groupImage: groupImage ?? '/images/default-groupImage.png',
      });
      newGroup.owner = owner;
      await this.group.save(newGroup);

      return { ok: true, groupId: newGroup.id };
    } catch {
      return {
        ok: false,
        error: '그룹을 만들 수 없습니다.',
      };
    }
  }

  async editGroup(
    owner: User,
    editGroupInput: EditGroupInput,
  ): Promise<EditGroupOutput> {
    try {
      const group = await this.group.findOne({
        where: { id: editGroupInput.groupId },
      });
      if (!group) {
        return {
          ok: false,
          error: '그룹을 수정할 수 없습니다.',
        };
      }
      console.log('📢 [group.service.ts:그룹]', group.ownerId);
      console.log('📢 [group.service.ts:오너]', owner.id);

      const isNotAuthorizedOwner = owner.id !== group.ownerId;
      if (isNotAuthorizedOwner) {
        return {
          ok: false,
          error: '그룹장만 수정할 수 있습니다.',
        };
      }

      await this.group.save([
        {
          id: editGroupInput.groupId,
          ...editGroupInput,
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
}
