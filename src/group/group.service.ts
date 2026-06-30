import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';

export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly group: Repository<Group>,
  ) {}
  getAll(): Promise<Group[]> {
    return this.group.find();
  }
}
