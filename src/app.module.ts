import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_CONNECTION}`),
    PlayerModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
