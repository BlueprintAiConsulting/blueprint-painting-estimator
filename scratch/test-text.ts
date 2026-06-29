import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function testText() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: 'Say hello world' }] }
    });
    console.log('Success!', response.text);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Error:', msg);
  }
}

testText();
