import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true, collection: 'players' })
export class Player {
  _id: string;

  @Prop()
  phoneNumber: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  urlAvatar: string;

  @Prop()
  readonly ranking: string;

  @Prop()
  readonly rankPosition: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
