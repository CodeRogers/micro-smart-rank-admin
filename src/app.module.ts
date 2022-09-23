import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category/schema/categories.schema';
import { PlayerModule } from './player/player.module';
import { CategoryModule } from './category/category.module';
import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_CONNECTION}`),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    PlayerModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
