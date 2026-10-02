import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@InputType()
export class CategoryInput {
  @Field(() => Int)
  categoryId: number;

  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class CategoryOutput extends CoreOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
