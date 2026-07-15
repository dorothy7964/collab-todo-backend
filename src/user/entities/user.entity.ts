import { CoreEntity } from '@/common/entities/core.entity';
import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEnum, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';

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

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsString()
  profileImage: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      console.log('📢 [user.entity.ts:60]', this.password);
    } catch (e: unknown) {
      console.log('📢 [user.entity.ts][hashPassword]', e);
      throw new InternalServerErrorException(); // throw 한 건 service파일 내부에서 catch 할 것이다.
    }
  }
}
