import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './schemas/player.schema';

@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @MessagePattern('createPlayer')
  async create(@Payload() createPlayerDto: CreatePlayerDto) {
    return await this.playerService.create(createPlayerDto);
  }

  @MessagePattern('findAllPlayer')
  async findAll(@Payload() _id: string): Promise<Player | Player[]> {
    return _id
      ? await this.playerService.findOne(_id)
      : await this.playerService.findAll();
  }

  @MessagePattern('updatePlayer')
  @HttpCode(HttpStatus.NO_CONTENT || 204)
  async update(
    @Payload('_id') _id: string,
    @Payload('updatePlayerDto') updatePlayerDto: UpdatePlayerDto,
  ) {
    return await this.playerService.update(_id, updatePlayerDto);
  }

  @MessagePattern('removePlayer')
  @HttpCode(HttpStatus.NO_CONTENT || 204)
  async remove(@Payload() _id: string) {
    return await this.playerService.remove(_id);
  }
}
