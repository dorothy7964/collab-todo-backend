import { CoreOutput } from '@/common/dtos/output.dto';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => Int)
  @IsInt()
  groupId: number;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @Field(() => String, { nullable: true })
  categoryImage?: string;
}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
