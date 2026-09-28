import { Group } from '@/group/entities/group.entity';
import { User } from '@/user/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@ObjectType()
@Entity()
@Unique(['group', 'user'])
export class GroupMemberBan {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Group)
  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  group: Group;

  @Field(() => User)
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Field()
  @CreateDateColumn()
  bannedAt: Date; // 그룹에서 멤버가 차단된 날짜
}
