import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument } from './schemas/session.schema';
import { OpenAIService } from './openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Session')
    private readonly sessionModel: Model<SessionDocument>,
    private readonly openAIService: OpenAIService,
  ) {}

  async findOrCreateSession(sessionId: string): Promise<SessionDocument> {
    let session = await this.sessionModel.findOne({ sessionId });
    if (!session) {
      session = new this.sessionModel({ sessionId });
      await session.save();
    }
    return session;
  }

  async createSession(sessionId: string): Promise<void> {
    await this.findOrCreateSession(sessionId);
  }

  async endSession(sessionId: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate(
      { sessionId },
      { endTime: new Date() },
    );
  }

  async clearChatHistory(sessionId: string): Promise<void> {
    await this.sessionModel.findOneAndUpdate({ sessionId }, { questions: [] });
  }

  async getChatHistory(
    sessionId: string,
  ): Promise<{ question: string; answer?: string }[]> {
    const session = await this.findOrCreateSession(sessionId);
    return session.questions;
  }

  async processUserAnswer(sessionId: string, answer: string): Promise<void> {
    const session = await this.findOrCreateSession(sessionId);
    const currentQuestionIndex = session.questions.length;
    const previousQuestions = session.questions;

    if (currentQuestionIndex > 0) {
      session.questions[currentQuestionIndex - 1].answer = answer;
      await session.markModified('questions');
      await session.save();
    }
    const newQuestion =
      await this.openAIService.generateQuestion(previousQuestions);
    session.questions.push({
      question: newQuestion,
    });
    await session.save();
  }

  async getNextUnansweredQuestion(sessionId: string): Promise<string> {
    const session = await this.findOrCreateSession(sessionId);
    const nextQuestionIndex = session.questions.length;

    if (nextQuestionIndex > 0) {
      return session.questions[nextQuestionIndex - 1].question;
    }

    const initialQuestion = await this.openAIService.generateQuestion([]);
    session.questions.push({
      question: initialQuestion,
    });
    await session.save();

    return initialQuestion;
  }
}
