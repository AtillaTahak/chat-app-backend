import { Module } from '@nestjs/common';
import { ChatService } from './chatbot.service';
import { ChatGateway } from './chatbot.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schemas/session.schema';
import { OpenAIService } from './openai.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
  ],
  providers: [ChatService, ChatGateway, OpenAIService],
})
export class ChatModule {}
