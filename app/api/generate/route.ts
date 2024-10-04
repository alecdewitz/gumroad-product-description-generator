import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { descriptionSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = await streamObject({
    model: openai("gpt-4-turbo"),
    schema: descriptionSchema,
    prompt: `Generate 3 high-converting product descriptions optimized for Gumroad.com. Use the following context: ${JSON.stringify(
      context
    )}

    For each description:
    1. Create a compelling, attention-grabbing title (max 60 characters)
    2. Write a strong hook that immediately captures interest (1-2 sentences)
    3. List 3-5 key features, using emojis as bullet points
    4. Highlight 2-3 main benefits, focusing on how it solves the user's problems
    5. Include a unique selling proposition (USP) that sets this product apart
    6. End with a clear, persuasive call-to-action

    Guidelines:
    - Use a conversational, engaging tone that resonates with the target audience
    - Incorporate power words and emotional triggers to boost conversions
    - Keep paragraphs short and use white space effectively for readability
    - Naturally weave in relevant keywords throughout the description
    - Use social proof or testimonials if applicable
    - Address potential objections preemptively
    - Emphasize scarcity or urgency if relevant (e.g., limited-time offer)
    - Ensure each description is unique and tailored to the product's specific attributes

    Remember, the goal is to create descriptions that not only inform but also persuade and convert visitors into buyers on Gumroad.com.`,
  });

  return result.toTextStreamResponse();
}
