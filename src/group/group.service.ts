import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { User } from '@/user/entities/user.entity';

export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>,
  ) {}
  getAll(): Promise<Group[]> {
    return this.group.find();
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
