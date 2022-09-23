import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Player } from '../../player/schemas/player.schema';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Prop({ type: String, unique: true })
  readonly name: string;

  @Prop()
  description: string;

  @Prop()
  events: Array<Events>;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }] })
  players: Player[];
}

export interface Events {
  name: string;
  operation: string;
  value: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
