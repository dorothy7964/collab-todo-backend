import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { Group } from '../entities/group.entity';

@ObjectType()
export class MyGroupsOutput extends CoreOutput {
  @Field(() => [Group], { nullable: true })
  groups?: Group[];
}
