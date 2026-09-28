import { CoreEntity } from '@/common/entities/core.entity';
import { Group } from '@/group/entities/group.entity';
import { User } from '@/user/entities/user.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';

export enum GroupMemberRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

registerEnumType(GroupMemberRole, {
  name: 'GroupMemberRole',
  description: '그룹 맴버 타입',
  valuesMap: {
    OWNER: { description: '그룹장' },
    MEMBER: { description: '그룹 맴버' },
  },
});

@ObjectType()
@Entity()
export class GroupMember extends CoreEntity {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.groupMembers)
  user: User;

  @Field(() => Group)
  @ManyToOne(() => Group, (group) => group.members) // Group 엔티티에 있는 members와 연결한다는 뜻
  group: Group; // GroupMember가 어떤 Group에 속해 있는지 저장하는 속성

  @Column({ type: 'enum', default: 'MEMBER', enum: GroupMemberRole })
  @Field(() => GroupMemberRole)
  @IsEnum(GroupMemberRole)
  role: GroupMemberRole;

  // 그룹 멤버가 그룹에 가입한 날짜/시간을 저장
  @CreateDateColumn()
  @Field(() => Date)
  joinedAt: Date;
}
