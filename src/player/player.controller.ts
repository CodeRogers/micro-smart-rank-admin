import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @MessagePattern('createPlayer')
  create(@Payload() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @MessagePattern('findAllPlayer')
  findAll() {
    return this.playerService.findAll();
  }

  @MessagePattern('findOnePlayer')
  findOne(@Payload() id: number) {
    return this.playerService.findOne(id);
  }

  @MessagePattern('updatePlayer')
  update(@Payload() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(updatePlayerDto.id, updatePlayerDto);
  }

  @MessagePattern('removePlayer')
  remove(@Payload() id: number) {
    return this.playerService.remove(id);
  }
}
