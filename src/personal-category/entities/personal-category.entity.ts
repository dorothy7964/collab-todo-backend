import { CoreEntity } from '@/common/entities/core.entity';
import { Todo } from '@/todo/entities/todo.entity';
import { User } from '@/user/entities/user.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@InputType('PersonalCategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class PersonalCategory extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Column({ default: 'default-category.png' })
  @Field(() => String)
  @IsString()
  categoryImage: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  // 개인 카테고리
  @ManyToOne(() => User, (user) => user.personalCategories, { nullable: false })
  user: User;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  sortOrder?: number;

  @Field(() => [Todo])
  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[];

  // 삭제일
  @DeleteDateColumn({ nullable: true }) deletedAt?: Date;
}
