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

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMember: Repository<GroupMember>,

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
}
