import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupMember, GroupMemberRole } from './entities/group-member.entity';
import { Group } from '@/group/entities/group.entity';
import { User } from '@/user/entities/user.entity';
import {
  CreateGroupMemberInput,
  CreateGroupMemberOutput,
} from './dtos/create-group-member.dto';
import {
  GetGroupMembersInput,
  GetGroupMembersOutput,
} from './dtos/group-members.dto';
import {
  InviteGroupMemberInput,
  InviteGroupMemberOutput,
} from './dtos/invite-group-member.dto';
import { GroupMemberBan } from './entities/group-member-ban.entity';
import {
  RemoveGroupMemberInput,
  RemoveGroupMemberOutput,
} from './dtos/remove-group-member.dto';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMember: Repository<GroupMember>,

    @InjectRepository(GroupMemberBan)
    private readonly groupMemberBan: Repository<GroupMemberBan>,

    @InjectRepository(Group)
    private readonly group: Repository<Group>,

    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  // 멤버 목록 조회
  async getGroupMembers(
    getGroupMembersInput: GetGroupMembersInput,
  ): Promise<GetGroupMembersOutput> {
    try {
      const groupMembers = await this.groupMember.find({
        where: {
          group: { id: getGroupMembersInput.groupId },
        },
        relations: {
          user: true,
        },
      });
      console.log('📢 [group.service.ts:38]', groupMembers);
      return { ok: true, groupMembers };
    } catch {
      return {
        ok: false,
        error: '그룹 멤버를 찾을 수 없습니다.',
      };
    }
  }

  // 그룹 내보낸 맴버 재가입 방지
  private async isGroupMemberBanned(
    groupId: number,
    userId: number,
  ): Promise<boolean> {
    const banned = await this.groupMemberBan.findOne({
      where: {
        group: { id: groupId },
        user: { id: userId },
      },
    });

    return !!banned;
  }

  // 그룹 가입 (일반적인 그룹 가입)
  async createGroupMember(
    authUser: User,
    createGroupMemberInput: CreateGroupMemberInput,
  ): Promise<CreateGroupMemberOutput> {
    try {
      const group = await this.group.findOne({
        where: {
          id: createGroupMemberInput.groupId,
        },
      });

      if (!group) {
        return {
          ok: false,
          error: '그룹을 찾을 수 없습니다.',
        };
      }

      // 이미 그룹에 속해 있는지 확인
      const exists = await this.groupMember.findOne({
        where: {
          group: { id: createGroupMemberInput.groupId },
          user: { id: authUser.id },
        },
      });

      if (exists) {
        return {
          ok: false,
          error: '이미 그룹에 속한 사용자입니다.',
        };
      }

      // 재가입 차단 여부 확인
      if (await this.isGroupMemberBanned(group.id, authUser.id)) {
        return {
          ok: false,
          error: '해당 그룹에서 내보내진 사용자는 다시 가입할 수 없습니다.',
        };
      }

      await this.groupMember.save(
        this.groupMember.create({ group, user: authUser }),
      );
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '그룹 멤버 추가에 실패했습니다.',
      };
    }
  }

  // 특정 사용자를 그룹 멤버로 추가
  async saveGroupMember(
    user: User,
    group: Group,
    role: GroupMemberRole,
  ): Promise<GroupMember> {
    const groupMember = this.groupMember.create({
      group,
      user,
      role,
    });

    return this.groupMember.save(groupMember);
  }

  // 그룹 멤버 초대
  async inviteGroupMember(
    authUser: User,
    inviteGroupMemberInput: InviteGroupMemberInput,
  ): Promise<InviteGroupMemberOutput> {
    try {
      const { groupId, userId } = inviteGroupMemberInput;

      const group = await this.group.findOne({
        where: { id: groupId },
      });

      if (!group) {
        return {
          ok: false,
          error: '그룹을 찾을 수 없습니다.',
        };
      }

      // 그룹장인지 확인
      if (group.ownerId !== authUser.id) {
        return {
          ok: false,
          error: '그룹장만 멤버를 초대할 수 있습니다.',
        };
      }

      const user = await this.user.findOne({
        where: { id: userId },
      });

      if (!user) {
        return {
          ok: false,
          error: '사용자를 찾을 수 없습니다.',
        };
      }

      // 이미 그룹에 속해 있는지 확인
      const exists = await this.groupMember.findOne({
        where: {
          group: { id: groupId },
          user: { id: userId },
        },
      });

      if (exists) {
        return {
          ok: false,
          error: '이미 그룹에 속한 사용자입니다.',
        };
      }

      // 재가입 차단 여부 확인
      if (await this.isGroupMemberBanned(group.id, user.id)) {
        return {
          ok: false,
          error: '해당 그룹에서 내보내진 사용자는 다시 가입할 수 없습니다.',
        };
      }

      await this.saveGroupMember(user, group, GroupMemberRole.MEMBER);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '그룹 멤버 초대에 실패했습니다.',
      };
    }
  }

  // 그룹 내보내기 (권한: 그룹장)
  async removeGroupMember(
    authUser: User,
    removeGroupMemberInput: RemoveGroupMemberInput,
  ): Promise<RemoveGroupMemberOutput> {
    try {
      const { groupId, userId } = removeGroupMemberInput;

      // 그룹 조회
      const group = await this.group.findOne({
        where: { id: groupId },
        relations: { owner: true },
      });

      if (!group) {
        return {
          ok: false,
          error: '그룹을 찾을 수 없습니다.',
        };
      }

      // 그룹장인지 확인
      if (group.ownerId !== authUser.id) {
        return {
          ok: false,
          error: '그룹장만 멤버를 내보낼 수 있습니다.',
        };
      }

      // 그룹장 본인은 내보낼 수 없음
      if (userId === group.ownerId) {
        return {
          ok: false,
          error: '그룹장은 내보낼 수 없습니다.',
        };
      }

      // 멤버 조회
      const groupMember = await this.groupMember.findOne({
        where: {
          group: { id: groupId },
          user: { id: userId },
        },
        relations: {
          user: true,
          group: true,
        },
      });

      if (!groupMember) {
        return {
          ok: false,
          error: '해당 사용자는 그룹 멤버가 아닙니다.',
        };
      }

      // 차단 기록 생성
      const ban = this.groupMemberBan.create({
        group,
        user: groupMember.user,
      });

      await this.groupMemberBan.save(ban);

      // 멤버에서 제거
      await this.groupMember.remove(groupMember);

      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '그룹 멤버를 내보낼 수 없습니다.',
      };
    }
  }
}
