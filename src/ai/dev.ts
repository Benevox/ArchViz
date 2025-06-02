import { config } from 'dotenv';
config();

import '@/ai/flows/extract-requirements.ts';
import '@/ai/flows/generate-user-flow.ts';
import '@/ai/flows/explain-component-rationale.ts';
import '@/ai/flows/generate-diagram.ts';