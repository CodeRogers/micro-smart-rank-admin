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

      const filterackErrors = ackErrors.filter((ackError) => {
        error.message.includes(ackError);
      });
      if (filterackErrors.length > 0) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('findAllCategory')
  async findAll(
    @Payload() name: string,
    @Ctx() context: RmqContext,
  ): Promise<Category | Category[]> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      return name
        ? await this.categoryService.findOne(name)
        : await this.categoryService.findAll();
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('updateCategory')
  async update(
    @Payload('_id') _id: string,
    @Payload('updateCategoryDto') updateCategoryDto: UpdateCategoryDto,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.categoryService.update(_id, updateCategoryDto);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error)}`);

      const filterAckErrors = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckErrors.length > 0) await channel.ack(originalMsg);
    }
  }

  @MessagePattern('deleteCategory')
  async remove(
    @Payload() name: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.categoryService.remove(name);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error)}`);

      const filterAckErrors = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckErrors.length > 0) await channel.ack(originalMsg);
    }
  }
}
