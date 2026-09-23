import { AuthUser } from '@/auth/auth-user.decorator';
import { User } from '@/user/entities/user.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import {
  CreateGroupMemberInput,
  CreateGroupMemberOutput,
} from './dtos/create-group-member.dto';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberService } from './group.service';
import { Role } from '@/auth/role.decorator';

@Resolver(() => GroupMember)
export class GroupMemberResolver {
  constructor(private readonly groupMemberService: GroupMemberService) {}

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
