import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';

@InputType()
export class GetCategoriesInput {
  @Field(() => Int)
  groupId: number;
}

@ObjectType()
export class GetCategoriesOutput extends CoreOutput {
  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
