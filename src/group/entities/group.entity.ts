import { CoreEntity } from '@/common/entities/core.entity';
import { User } from '@/user/entities/user.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('GroupInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Group extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ default: '/images/default-groupImage.png' })
  @Field(() => String)
  @IsString()
  groupImage: string;

  @Column({
    unique: true,
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @IsString()
  inviteCode?: string;

  @Field(() => User)
  @ManyToOne(() => User)
  // Group은 한 명의 소유자(Owner)를 가진다.
  // User는 여러 개의 Group을 소유할 수 있다.
  owner: User;

  @RelationId((group: Group) => group.owner)
  ownerId: number;
}
