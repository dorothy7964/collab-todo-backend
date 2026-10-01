import { CoreEntity } from '@/common/entities/core.entity';
import { GroupMember } from '@/group-member/entities/group-member.entity';
import { Group } from '@/group/entities/group.entity';
import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEnum, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '유저 타입',
  valuesMap: {
    ADMIN: { description: '관리자' },
    USER: { description: '회원' },
  },
});

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  email: string;

  @Column()
  @Field(() => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  nickname: string;

  @Column({ default: 'default-profile.png' })
  @Field(() => String)
  @IsString()
  profileImage: string;

  @OneToMany(() => Group, (group) => group.owner)
  // User는 여러 개의 Group을 소유할 수 있다.
  // 각 Group은 한 명의 소유자(Owner)를 가진다.
  ownedGroups: Group[];

  @OneToMany(() => GroupMember, (member) => member.user)
  groupMembers: GroupMember[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      console.log('📢 [user.entity.ts:60]', this.password);
    } catch (e: unknown) {
      console.log('📢 [user.entity.ts][hashPassword]', e);
      throw new InternalServerErrorException(); // throw 한 건 service파일 내부에서 catch 할 것이다.
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log('📢 [user.entity.ts][checkPassword]', e);
      throw new InternalServerErrorException();
    }
  }
}
