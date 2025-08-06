import { config } from "dotenv";
config(); // Load .env file

import { Agent, WindowBufferMemory } from "alith";

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
    console.error("❌ OPENROUTER_API_KEY is not set in the environment!");
    process.exit(1);
}

const agent = new Agent({
    model: "deepseek/deepseek-chat",
    memory: new WindowBufferMemory(),
    apiKey: apiKey,
    baseUrl: "https://openrouter.ai/api/v1",
    preamble:
        "You are a problem decomposition agent for a decentralized intelligence platform called Mindwave. Your job is to analyze complex problems and break them into modular sub-tasks, tagging each sub-task with its relevant field of expertise. Respond only with valid JSON.",
});

/**
 * Decomposes a complex problem into sub-tasks with tagged fields.
 * @param {string} problem - The problem description input by the user.
 * @returns {Promise<Array>} List of subtasks with their respective fields.
 */
export async function decompose(problem) {
    const prompt = `
A user has submitted the following complex problem:

"${problem}"

Break this problem down into 3 to 4 modular sub-tasks. Each sub-task should be specific, solvable independently, and tagged with a field of expertise (e.g., "AI", "biology", "economics", "design", "data science", etc).

"Generalize the field example ("behavioral economics": "economics","environmental economics": "environment", "transportation engineering": "transportation") and return the field associated with each subtask using only 1 word, example: ['AI', 'IoT', 'data science', 'economics', 'energy', 'biology', 'physics', 'environment', 'transportation', 'robotics', 'agriculture', 'finance']"

Respond only in the following JSON format:
[
  {
    "subtask": "...",
    "field": "..."
  },
  ...
]

Do not add any explanations or markdown formatting. Output only valid JSON.
`;

    try {
        const result = await agent.prompt(prompt);

        const cleaned = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);
    } catch (err) {
        console.error("❌ Failed to decompose problem:", err);
        throw err;
    }
}
