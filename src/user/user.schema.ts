import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({})
  enterprise: string;
}

export type UserDocument = User & Document & { _id: string };
export const UserSchema = SchemaFactory.createForClass(User);
