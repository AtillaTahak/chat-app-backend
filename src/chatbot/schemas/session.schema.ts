import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

interface QuestionAnswer {
  question: string;
  answer?: string;
}

@Schema()
export class Session {
  @Prop({ unique: true })
  sessionId: string;

  @Prop({ default: [] })
  questions: QuestionAnswer[];

  @Prop({ default: Date.now })
  startTime: Date;

  @Prop()
  endTime?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
