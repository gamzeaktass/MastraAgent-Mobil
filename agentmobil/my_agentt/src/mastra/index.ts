
import { Mastra } from '@mastra/core';
import { projectManagerAgent } from './agents/assistant.js';

export const mastra = new Mastra({
  agents: {
    projectManager: projectManagerAgent,
  },
});
