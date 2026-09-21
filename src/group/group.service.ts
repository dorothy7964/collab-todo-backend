import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { User } from '@/user/entities/user.entity';
import { MyGroupsOutput } from './dtos/my-groups.dto';

export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>,
  ) {}
  getAll(): Promise<Group[]> {
    return this.group.find();
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
}
