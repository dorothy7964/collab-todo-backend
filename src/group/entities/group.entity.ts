import { CoreEntity } from '@/common/entities/core.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Group extends CoreEntity {
  @Field()
  @Column()
  name: string;
}
