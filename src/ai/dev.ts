import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-markup.ts';
import '@/ai/flows/material-cost-forecaster.ts';
import '@/ai/flows/interpret-profile-selection.ts';
import '@/ai/flows/slab-analysis-flow.ts';
