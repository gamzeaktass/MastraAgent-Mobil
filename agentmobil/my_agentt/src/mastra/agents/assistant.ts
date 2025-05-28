import { Agent } from '@mastra/core';
import { createOpenAI } from '@ai-sdk/openai';

// Create OpenAI instance with API key
const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'apikey'
});

export const assistantAgent = new Agent({
  name: 'Assistant Agent',
  instructions: `Sen yardımcı bir AI asistanısın. Kullanıcılara Türkçe olarak yardım ediyorsun.
  Sorularını net ve anlaşılır bir şekilde yanıtlıyorsun.
  Eğer bir konuda emin değilsen, bunu açıkça belirtiyorsun.
  Her zaman kibar ve yardımsever bir ton kullanıyorsun.`,
  model: openaiClient('gpt-4o-mini'),
});
