import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from './entities/group-member.entity';
import { GroupMemberResolver } from './group-member.resolver ';
import { GroupMemberService } from './group-member.service';
import { Group } from '@/group/entities/group.entity';
import { User } from '@/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Group, User])],
  providers: [GroupMemberResolver, GroupMemberService],
  exports: [GroupMemberService],
})
export class GroupMemberModule {}
