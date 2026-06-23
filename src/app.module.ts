import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupModule } from "./group/group.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // 파일을 직접 갖을 필요 없어서 변경
    }),
    GroupModule
  ],
})
export class AppModule {}