import { Query, Resolver } from '@nestjs/graphql';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}
  @Query(() => [Group])
  group(): Promise<Group[]> {
    return this.groupService.getAll();
  }
}
