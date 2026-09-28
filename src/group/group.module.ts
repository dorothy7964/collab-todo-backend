import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { GroupMemberModule } from '@/group-member/group-member.module';
import { GroupResolver } from './group.resolver ';

@Module({
  imports: [TypeOrmModule.forFeature([Group]), GroupMemberModule],
  providers: [GroupResolver, GroupService],
})
export class GroupModule {}
