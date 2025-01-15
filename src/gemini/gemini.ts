import { GoogleGenerativeAI } from '@google/generative-ai'
import { safetySettings } from './geminiSafetySettings'

const APIKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(APIKey)
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
        candidateCount: 1,
        temperature: 1
    },
    safetySettings: safetySettings
})

export const generateWithGemini = async (prompt: string) => {
    const result = await model.generateContent(prompt)
    return result.response.text()
}