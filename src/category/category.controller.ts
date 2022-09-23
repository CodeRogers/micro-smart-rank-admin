import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schema/categories.schema';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('createCategory')
  async create(@Payload() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @MessagePattern('findAllCategory')
  async findAll(@Payload() name: string) {
    return name
      ? await this.categoryService.findOne(name)
      : await this.categoryService.findAll();
  }

  @MessagePattern('findOneCategory')
  async findOne(@Payload() _id: string): Promise<Category> {
    return await this.categoryService.findOne(_id);
  }

  @MessagePattern('updateCategory')
  update(@Payload() updateCategoryDto: UpdateCategoryDto) {
    console.log(updateCategoryDto);
    // return this.categoryService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: number) {
    return this.categoryService.remove(id);
  }
}
