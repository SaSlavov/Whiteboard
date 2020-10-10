import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [
    ControllersModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'whiteboard',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),],
})
export class AppModule { }
