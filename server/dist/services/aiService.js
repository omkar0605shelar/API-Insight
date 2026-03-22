import OpenAI from 'openai';
import prisma from '../config/client.js';
import redisClient from '../config/redis.js';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock_key',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});
export class AIService {
    async explainEndpoint(endpointId) {
        // 1. Check Redis Cache
        const cacheKey = `ai_explanation:${endpointId}`;
        if (redisClient.isOpen) {
            const cached = await redisClient.get(cacheKey);
            if (cached)
                return this.parseJsonResponse(cached);
        }
        // 2. Check DB
        const endpoint = await prisma.endpoint.findUnique({
            where: { id: endpointId },
            include: { project: true }
        });
        if (!endpoint) {
            const error = new Error('Endpoint not found');
            error.statusCode = 404;
            throw error;
        }
        if (endpoint.ai_explanation) {
            // Also cache in Redis
            if (redisClient.isOpen) {
                await redisClient.setEx(cacheKey, 86400, endpoint.ai_explanation);
            }
            return this.parseJsonResponse(endpoint.ai_explanation);
        }
        // 3. Call OpenAI
        const prompt = `
      Explain the following API endpoint in detail for a developer:
      Project Repository: ${endpoint.project.repository_url}
      Path: ${endpoint.path}
      Method: ${endpoint.method}
      Request Schema (Mock/Detected): ${JSON.stringify(endpoint.request_schema)}
      Response Schema (Mock/Detected): ${JSON.stringify(endpoint.response_schema)}
      
      Provide:
      1. Purpose (One-line description of what this endpoint does)
      2. Request Explanation (Explain the expected payload, parameters, and headers)
      3. Response Explanation (Explain the response fields and status codes)
      4. Use Case (A common scenario where this endpoint is used)
      
      Return ONLY a JSON object with keys: "purpose", "request_explanation", "response_explanation", "use_case".
    `;
        try {
            const response = await openai.chat.completions.create({
                model: "meta/llama-3.1-8b-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.1,
                max_tokens: 1024,
                response_format: { type: "json_object" },
            });
            const rawContent = response.choices[0]?.message?.content || "{}";
            const cleanedJson = this.parseJsonResponse(rawContent);
            // 4. Save to DB & Redis (save cleaned version)
            await prisma.endpoint.update({
                where: { id: endpointId },
                data: { ai_explanation: JSON.stringify(cleanedJson) }
            });
            if (redisClient.isOpen) {
                await redisClient.setEx(cacheKey, 86400, JSON.stringify(cleanedJson));
            }
            return cleanedJson;
        }
        catch (error) {
            console.error('AI Service Error:', error.message || error);
            throw new Error(`Failed to generate AI explanation: ${error.message}`);
        }
    }
    parseJsonResponse(text) {
        try {
            // 1. Try direct parse
            return JSON.parse(text);
        }
        catch (e) {
            // 2. Try extracting from markdown or text
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                }
                catch (innerError) {
                    console.error('Failed to parse extracted JSON:', jsonMatch[0]);
                }
            }
            console.error('Original text that failed parsing:', text);
            return {
                purpose: "Error generating explanation",
                request_explanation: "The AI response was not in a valid JSON format.",
                response_explanation: "Please try again.",
                use_case: "N/A"
            };
        }
    }
}
