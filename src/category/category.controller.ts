import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/categories.schema';

const ackErrors: string[] = ['E11000'];

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  logger = new Logger(CategoryController.name);

  @MessagePattern('createCategory')
  async create(
    @Payload() createCategoryDto: CreateCategoryDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.categoryService.create(createCategoryDto);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error)}`);
      ackErrors.map(async (ackError) => {
        if (error.message.includes(ackError)) await channel.ack(originalMsg);
      });
    }
  }

  @MessagePattern('findAllCategory')
  async findAll(@Payload() name: string): Promise<Category | Category[]> {
    return name
      ? await this.categoryService.findOne(name)
      : await this.categoryService.findAll();
  }

  @MessagePattern('findOneCategory')
  async findOne(@Payload() _id: string): Promise<Category> {
    return await this.categoryService.findOne(_id);
  }

  @MessagePattern('updateCategory')
  async update(
    @Payload('_id') _id: string,
    @Payload('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    return await this.categoryService.update(_id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
