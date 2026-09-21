import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { MyGroupsOutput } from './dtos/my-groups.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}
  @Query(() => [Group])
  group(): Promise<Group[]> {
    return this.groupService.getAll();
  }

  @Query(() => MyGroupsOutput)
  myGroups(@AuthUser() owner: User): Promise<MyGroupsOutput> {
    return this.groupService.getMyGroups(owner);
  }

  @Mutation(() => CreateGroupOutput)
  async createGroup(
    @AuthUser() authUser: User,
    @Args('input') createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    return this.groupService.createGroup(authUser, createGroupInput);
  }
}
