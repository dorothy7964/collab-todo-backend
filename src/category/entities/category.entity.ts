import { CoreEntity } from '@/common/entities/core.entity';
import { Group } from '@/group/entities/group.entity';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
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

  @Field(() => Group)
  @ManyToOne(() => Group, (group) => group.categories)
  group: Group;

  @Column({ default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  sortOrder?: number;
}
