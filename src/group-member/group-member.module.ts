import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberResolver } from './group-member.resolver ';
import { GroupMemberService } from './group-member.service';
import { Group } from '@/group/entities/group.entity';
import { User } from '@/user/entities/user.entity';
import { GroupMemberBan } from './entities/group-member-ban.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember, GroupMemberBan, Group, User]),
  ],
  providers: [GroupMemberResolver, GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
