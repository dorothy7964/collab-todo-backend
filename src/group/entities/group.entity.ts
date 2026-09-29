import { Category } from '@/category/entities/category.entity';
import { CoreEntity } from '@/common/entities/core.entity';
import { GroupMember } from '@/group-member/entities/group-member.entity';
import { User } from '@/user/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

@InputType('GroupInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Group extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  description?: string;

  @Column({ default: '/images/default-groupImage.png' })
  @Field(() => String)
  @IsString()
  groupImage: string;

  @Column({
    default: true,
  })
  @Field(() => Boolean, { nullable: true })
  isPublic: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  inviteCode?: string;

  @Field(() => User)
  @ManyToOne(() => User)
  // Group은 한 명의 소유자(Owner)를 가진다.
  // User는 여러 개의 Group을 소유할 수 있다.
  owner: User;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @RelationId((group: Group) => group.owner)
  ownerId: number;

  @OneToMany(() => Category, (category) => category.group)
  categories: Category[];

  @DeleteDateColumn({ nullable: true }) deletedAt?: Date;
}
