import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schema/categories.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  private readonly logger = new Logger(CategoryService.name);

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const categoryFound = await this.categoryModel.findOne({ name });

    if (categoryFound) {
      this.logger.error(`Fail to create category, already exists`);
      throw new RpcException({
        statusCode: 400,
        message: `Category ${name} already exists`,
      });
    }

    const category = new this.categoryModel(createCategoryDto);

    try {
      const categoryCreated = await category.save();
      return categoryCreated;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException({ statusCode: 400, message: error.message });
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().populate('players');
    return categories;
  }

  async findOne(name: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ name });
    if (!category) {
      this.logger.error(`Category ${name} not found`);
      throw new RpcException({
        statusCode: 404,
        message: `Category '${name}' not found.`,
      });
    }
    return category;
  }

  async update(
    _id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    try {
      await this.findOne(updateCategoryDto.name);
    } catch (error) {
      throw new RpcException({ statusCode: 400, message: error.message });
    }
    await this.categoryModel.findOneAndUpdate(
      { _id },
      { $set: updateCategoryDto },
    );
  }

  async remove(name: string): Promise<void> {
    try {
      await this.findOne(name);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException({ statusCode: 400, message: error.message });
    }
    await this.categoryModel.findOneAndDelete({ name });
  }
}
