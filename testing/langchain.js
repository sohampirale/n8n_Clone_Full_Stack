const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { DynamicTool } = require("@langchain/core/tools");
const { AgentExecutor, createToolCallingAgent } = require("langchain/agents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { z } = require("zod");

// Define the schema for the tools using Zod
const numberArraySchema = z.object({
  numbers: z.array(z.number()).describe("An array of numbers to process. Example: [3, 4, 5] for multiplying 3, 4, and 5."),
});

// Tool 1: Sum of Numbers
const sumOfNum = new DynamicTool({
  name: "sumOfNum",
  description: "Calculates the sum of an array of numbers. Use this when asked to add numbers. Example input: [5, 10, 15].",
  schema: numberArraySchema,
  func: async ({ numbers }) => {
    console.log('numbers received : ',numbers);
    
    try {
      // if (!Array.isArray(numbers) || numbers.length === 0) {
      //   throw new Error("Input must be a non-empty array of numbers");
      // }
      const sum = numbers.reduce((acc, curr) => acc + curr, 0);
      console.log(`sumOfNum called with numbers: ${JSON.stringify(numbers)}, result: ${sum}`);
      console.log('result of sum is : ',sum);
      process.exit()
      
      return JSON.stringify({ result: sum });
    } catch (error) {
      console.error(`Error in sumOfNum: ${error.message}`);
      return JSON.stringify({ error: `Failed to calculate sum: ${error.message}` });
    }
  },
});

// List of tools
const tools = [sumOfNum];

// Create a prompt template for the agent
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a precise calculator assistant. Extract numbers from the user's query and use the sumOfNum tool to add numbers or the multiplicationOfNum tool to multiply numbers. Format the input as an array of numbers (e.g., [3, 4, 5] for 'multiply 3, 4, and 5'). Return only the numerical result or an error message if the input is invalid."],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Initialize the LLM (Gemini 1.5 Flash)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey: "AIzaSyCtU3dZySRYqKRVPxzq9eyS8naHKhh3Lqc",
});

// Create the agent with tool-calling capabilities
const agent = createToolCallingAgent({
  llm,
  tools,
  prompt,
});

// Create the executor to run the agent
const executor = new AgentExecutor({
  agent,
  tools,
  maxIterations: 2, // Prevent infinite loops
});

// Main function to run the example
async function main() {
  try {
    // Example query 1: Sum
    const sumResult = await executor.invoke({
      input: "What is the sum of 5, 10, and 15?",
    });
    console.log("Sum Result:", sumResult.output);

  } catch (error) {
    console.error("Executor Error:", error);
  }
}

// Run the example
main();