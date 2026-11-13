import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType()
export class DeletePersonalCategoryInput {
  @Field(() => Int)
  categoryId: number;
}

@ObjectType()
export class DeletePersonalCategoryOutput extends CoreOutput {}
