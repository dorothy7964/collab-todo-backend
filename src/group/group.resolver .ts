import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateGroupInput, CreateGroupOutput } from './dtos/create-group.dto';
import { MyGroupsOutput } from './dtos/my-groups.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { GroupInput, GroupOutput } from './dtos/group.dto';
import { EditGroupInput, EditGroupOutput } from './dtos/edit-group-dto';
import { Role } from '@/auth/role.decorator';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}
  // 그룹 전체 보기
  @Query(() => [Group])
  groups(): Promise<Group[]> {
    return this.groupService.getAll();
  }

  // 특정 그룹 보기
  @Query(() => GroupOutput)
  group(@Args('input') groupInput: GroupInput): Promise<GroupOutput> {
    return this.groupService.findGroupById(groupInput);
  }

  // 내가 속한 그룹 보기
  @Query(() => MyGroupsOutput)
  myGroups(@AuthUser() owner: User): Promise<MyGroupsOutput> {
    return this.groupService.getMyGroups(owner);
  }

  // 그룹 생성
  @Mutation(() => CreateGroupOutput)
  @Role(['Any'])
  async createGroup(
    @AuthUser() authUser: User,
    @Args('input') createGroupInput: CreateGroupInput,
  ): Promise<CreateGroupOutput> {
    return this.groupService.createGroup(authUser, createGroupInput);
  }

  // 그룹 수정
  @Mutation(() => EditGroupOutput)
  async editGroup(
    @AuthUser() authUser: User,
    @Args('input') editGroupInput: EditGroupInput,
  ): Promise<EditGroupOutput> {
    return this.groupService.editGroup(authUser, editGroupInput);
  }
}
