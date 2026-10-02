import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeleteCategoryInput {
  @Field(() => Int)
  categoryId: number;

  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class DeleteCategoryOutput extends CoreOutput {}
