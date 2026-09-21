import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}
  @Query(() => [Group])
  group(): Promise<Group[]> {
    return this.groupService.getAll();
  }

  @Mutation(() => CreateGroupOutput)
  async createGroup(
    @AuthUser() authUser: User,
    @Args('input') createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    return this.groupService.createGroup(authUser, createGroupInput);
  }
}
