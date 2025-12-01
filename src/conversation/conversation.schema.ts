import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'Nova Conversa' })
  title: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
