import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Role } from '@/auth/role.decorator';
import {
  CreateGroupMemberInput,
  CreateGroupMemberOutput,
} from './dtos/create-group-member.dto';
import {
  GetGroupMembersInput,
  GetGroupMembersOutput,
} from './dtos/group-members.dto';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberService } from './group.service';

@Resolver(() => GroupMember)
export class GroupMemberResolver {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  // 멤버 목록 조회
  @Query(() => GetGroupMembersOutput)
  getGroupMembers(
    @Args('input') getGroupMembersInput: GetGroupMembersInput,
  ): Promise<GetGroupMembersOutput> {
    return this.groupMemberService.getGroupMembers(getGroupMembersInput);
  }

  // 그룹 멤버 추가
  @Mutation(() => CreateGroupMemberOutput)
  @Role(['Any'])
  async createGroupMember(
    @AuthUser() authUser: User,
    @Args('input') createGroupMemberInput: CreateGroupMemberInput,
  ): Promise<CreateGroupMemberOutput> {
    return this.groupMemberService.createGroupMember(
      authUser,
      createGroupMemberInput,
    );
  }
}
