import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  logger = new Logger(PlayerService.name);

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModel(createPlayerDto);
    const playerCreated = await player.save();
    return playerCreated;
  }

  async findAll(): Promise<Player[]> {
    const players = await this.playerModel.find();
    return players;
  }

  async findOne(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id });
    if (!player) {
      this.logger.error(`Player with _id: ${_id} not found`);
      throw new RpcException({
        statusCode: 404,
        message: `Player with _id: ${_id} not found`,
      });
    }
    return player;
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
    try {
      await this.playerModel.findOneAndUpdate(
        { _id },
        { $set: updatePlayerDto },
      );
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error)}`);
      throw new RpcException({
        statusCode: 400,
        message: `${JSON.stringify(error)}`,
      });
    }
  }

  async remove(_id: string): Promise<void> {
    try {
      await this.playerModel.findByIdAndDelete({ _id });
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error)}`);
      throw new RpcException({
        statusCode: 400,
        message: `${JSON.stringify(error)}`,
      });
    }
  }
}
