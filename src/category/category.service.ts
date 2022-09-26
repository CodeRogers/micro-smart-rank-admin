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

  private readonly logger = new Logger(Category.name);

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const categoryFound = await this.categoryModel.findOne({ name });

    if (categoryFound) {
      this.logger.error(`Fail to create category, already exists`);
      throw new RpcException(`Category ${name} already exists`);
    }

    const category = new this.categoryModel(createCategoryDto);

    try {
      const categoryCreated = new this.categoryModel(category);
      return await categoryCreated.save();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException({ statusCode: 400, message: error.message });
    }
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().populate('players');
    return categories;
  }

  async findOne(name: string) {
    const category = await this.categoryModel.findOne({ name });
    if (!category) {
      throw new RpcException({
        statusCode: 404,
        message: `Category '${name}' not found.`,
      });
    }
    return category;
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryModel.findOneAndUpdate(
        { _id },
        { $set: updateCategoryDto },
      );
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException({ statusCode: 400, message: error.message });
    }
  }

  async remove(id: number) {
    console.log(`Delete: ${id}`);
    return;
  }
}
