import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { SubscribersModule } from './modules/subscribers/subscribers.module';
import { UsersModule } from './modules/users/users.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('app.db.host'),
        port: config.get<number>('app.db.port'),
        username: config.get<string>('app.db.username'),
        password: config.get<string>('app.db.password'),
        database: config.get<string>('app.db.database'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        synchronize: config.get<string>('app.env') !== 'production',
        logging: config.get<string>('app.env') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    NewsletterModule,
    SubscribersModule,
  ],
})
export class AppModule {}
