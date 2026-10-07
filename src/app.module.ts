import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { GroupMember } from './group-member/entities/group-member.entity';
import { GroupMemberModule } from './group-member/group-member.module';
import { Group } from './group/entities/group.entity';
import { GroupModule } from './group/group.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from './jwt/jwt.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { GroupMemberBan } from './group-member/entities/group-member-ban.entity';
import { Category } from './category/entities/category.entity';
import { CategoryModule } from './category/category.module';
import { Todo } from './todo/entities/todo.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule이 전역으로 설정되어야 하는지 여부
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // 서버에 deploy 할 때 환경변수 파일을 사용하지 않기
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // port는 number 값이어야 한다. + 붙여주기
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: true,
      entities: [User, Group, GroupMember, GroupMemberBan, Category, Todo],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // graphiql: true, // GraphQL Playground 유지보수 종료로 GraphiQL 사용
      autoSchemaFile: true, // 파일을 직접 갖을 필요 없어서 변경
      context: ({ req }: { req: Record<string, unknown> }) => ({
        user: req['user'],
      }),
    }),
    GroupModule,
    GroupMemberModule,
    CommonModule,
    UserModule,
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    CategoryModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
