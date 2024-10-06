import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

const EXAMPLE_QUESTIONS: string[] = [
  'What is your favorite breed of cat, and why?',
  'How do you think cats communicate with their owners?',
  'Have you ever owned a cat? If so, what was their name ve personality like?',
  'Why do you think cats love to sleep in small, cozy places?',
  'What’s the funniest veya strangest behavior you’ve ever seen a cat do?',
  'Do you prefer cats or kittens, and what’s the reason for your preference?',
  'Why do you think cats are known for being independent animals?',
  'How do you think cats manage to land on their feet when they fall?',
  'What’s your favorite fact or myth about cats?',
  'How would you describe the relationship between humans and cats in three words?',
  'In a debate over cats vs. dogs, which would you prefer and why?',
];

@Injectable()
export class OpenAIService {
  private readonly openai: OpenAI | null = null;
  private readonly logger = new Logger(OpenAIService.name);

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
      });
      this.logger.log('OpenAI Service Initialized');
    } else {
      this.logger.warn('OPENAI_API_KEY is not set. OpenAIService is disabled.');
    }
  }

  async generateQuestion(
    previousQA: { question: string; answer?: string }[] = [],
  ): Promise<string> {
    if (!this.openai) {
      const nextIndex =
        previousQA.length < EXAMPLE_QUESTIONS.length ? previousQA.length : 0;
      return EXAMPLE_QUESTIONS[nextIndex] ?? 'No more questions available.';
    }

    const exampleQuestions = EXAMPLE_QUESTIONS.map((q) => `Q: ${q}`).join('\n');
    const conversation = previousQA
      .map((qa) => `Q: ${qa.question}\nA: ${qa.answer ?? ''}`)
      .join('\n');
    const promptBase = `
You are a chatbot that's knowledgeable about cats. Here are some example questions about cats:
${exampleQuestions}

Here's the previous conversation with the user:
${conversation}
Based on this conversation, ask the user a personalized, relevant and interesting question about cats.`;

    const response = await this.openai.completions.create({
      model: 'text-davinci-003',
      prompt: promptBase,
      max_tokens: 150,
    });

    return response.choices[0].text.trim();
  }

  async getStaticQuestion(index) {
    return EXAMPLE_QUESTIONS[index];
  }
}
