import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@InputType()
export class GetCategoryTodosInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class GetCategoryTodosOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
