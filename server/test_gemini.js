import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing with API key present:', Boolean(process.env.GEMINI_API_KEY));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

for (const model of models) {
  try {
    console.log(`Trying model: ${model}...`);
    const res = await ai.models.generateContent({
      model,
      contents: 'Say OK',
    });
    console.log(`SUCCESS with ${model}:`, res.text);
    break;
  } catch (e) {
    console.log(`Failed ${model}:`, e.message || e.status);
  }
}
