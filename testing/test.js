import { GoogleGenAI } from "@google/genai";


//tools
function calculateSum(a, b) {
  console.log(`Tool called: calculateSum(${a}, ${b})`);
  return a + b;
}

function calculateProduct(a, b, c) {
  console.log(`Tool called: calculateProduct(${a}, ${b}, ${c})`);
  return a * b * c;
}

function fetchTemperature(cityName) {
  return Math.random() * 100
}

const availableTools = {
  calculateSum: calculateSum,
  calculateProduct: calculateProduct,
  fetchTemperature
};

//tools declaration
const tools = [
  {
    name: "calculateSum",
    description: "Calculates the sum of two numbers.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "The first number to add.",
        },
        b: {
          type: "number",
          description: "The second number to add.",
        },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "calculateProduct",
    description: "Calculates the product of three numbers.",
    parametersJsonSchema: {
      type: "object",
      properties: {
        a: {
          type: "number",
          description: "The first number to multiply.",
        },
        c: {
          type: "number",
          description: "The third number to multiply.",
        },
        b: {
          type: "number",
          description: "The second number to multiply.",
        },
      },
      required: ["a", "c"],
    },
  },
  {
    name: "fetchTemperature",
    description: "Fetched the temperature of a city",
    parametersJsonSchema: {
      type: "object",
      properties: {
        cityName: {
          type: "string",
          description: "Name of the city whose temperature is needed",
        }
      },
      required: ["cityName"],
    },
  }
]


const ai = new GoogleGenAI({ apiKey: "AIzaSyCtU3dZySRYqKRVPxzq9eyS8naHKhh3Lqc" });
// const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });


async function worker() {
  try {
    const userPrompt = `What is the current temperature of mumbai & chennai? and what is 2+3? & 132343243*23423423*43423?`

    console.log(`User query: ${userPrompt}`);

    const response = await ai.models.generateContent({
      contents: userPrompt,
      model: 'gemini-2.0-flash',
      config: {
        tools: [{
          functionDeclarations: tools
        }
        ]
      }
    });

    console.log('response.functionCalls : ', response.functionCalls);

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length != 0) {
      const functionResponses = []

      for (let i = 0; i < functionCalls.length; i++) {
        const { args, name } = functionCalls[i]
        console.log('name of the function call : ', name);
        console.log('args for the function call : ', args);
        let result = 'unknown_tool';
        if (name == 'calculateSum') {
          result = calculateSum(args.a,args.b)
        } else if (name == 'calculateProduct') {
          result = calculateProduct(args.a,args.b,args.c)
        } else if (name == 'fetchTemperature') {
          result = fetchTemperature(args.cityName)
        }

        functionResponses.push({
          functionResponse: {
            name,
            response: { result }
          }
        });
      }

      const finalResult = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: "user",
            parts: [{ text:userPrompt}]
          },
          response.candidates[0].content,
          { role: 'user', parts: functionResponses }
        ],  
      });
      console.log(finalResult.text)
    } else {
      console.log('No tool calls needed response : ',response.text);
      
    }

  } catch (error) {
    console.log('ERROR : ', error);
  }
}

worker()