import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatService } from './chatbot.service';

@WebSocketGateway(3002, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('userAnswer')
  async handleChatMessage(
    @MessageBody() message: { sessionId: string; answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId, answer } = message;
    await this.chatService.processUserAnswer(sessionId, answer);
    const nextQuestion =
      await this.chatService.getNextUnansweredQuestion(sessionId);
    client.emit('newQuestion', nextQuestion);
  }

  @SubscribeMessage('registerSession')
  async handleRegisterSession(
    @MessageBody() message: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = message;
    await this.chatService.createSession(sessionId);
    const chatHistory = await this.chatService.getChatHistory(sessionId);
    client.emit('chatHistory', chatHistory);
  }

  @SubscribeMessage('clearHistory')
  async handleClearHistory(
    @MessageBody() message: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { sessionId } = message;
    await this.chatService.clearChatHistory(sessionId);
    const initialQuestion =
      await this.chatService.getNextUnansweredQuestion(sessionId);
    client.emit('chatHistory', []);
    client.emit('newQuestion', initialQuestion);
  }

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
