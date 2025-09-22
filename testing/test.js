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

function squareOfNum(num) {
  return num * num;
}

function powerOfNum(base,power){
  return Math.pow(base,power)
}

const availableTools = {
  calculateSum: calculateSum,
  calculateProduct: calculateProduct,
  fetchTemperature
};

//tools declaration



const ai = new GoogleGenAI({ apiKey: "AIzaSyCtU3dZySRYqKRVPxzq9eyS8naHKhh3Lqc" });
// const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });


async function worker() {
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
    },
    {
      name: "squareOfNum",
      description: "Calculates square of a number",
      parametersJsonSchema: {
        type: "object",
        properties: {
          number: {
            type: "number",
            description: "number whose square needs to be calculated",
          }
        },
        required: ["number"],
      },
    },
    {
      name: "incognitoRatio",
      description: "Calculates incognito ratio of 3 cities temperature",
      parametersJsonSchema: {
        type: "object",
        properties: {
          cityName1: {
            type: "string",
            description: "temperatur of city1",
          },
          cityName2: {
            type: "string",
            description: "temperatur of city2",
          },
          cityName3: {
            type: "string",
            description: "temperatur of city3",
          }
        },
        required: ["cityName1", "cityName2", "cityName3"],
      },
    }
  ]
  try {
    // const userPrompt = `What is the current temperature of mumbai & chennai? and what is 2+3? & 132343243*23423423*43423?`
    // const userPrompt = `What is the square of the number you get when you add 2 and 3?`
    // const userPrompt = `What is temperatur of mumbai and pune and Banglore? also what incognitoRatio of them?use the tool named incognitoRatio`
    const userPrompt = `First calculate (2+3) then raise this to the power of 2`


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
          result = calculateSum(args.a, args.b)
        } else if (name == 'calculateProduct') {
          result = calculateProduct(args.a, args.b, args.c)
        } else if (name == 'fetchTemperature') {
          result = fetchTemperature(args.cityName)
        } else if (name == 'squareOfNum') {
          result = squareOfNum(args.number)
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
            parts: [{ text: userPrompt }]
          },
          {
            role: "model",
            parts: response.candidates[0].content.parts
          },
          {
            role: 'function',
            parts: functionResponses
          }
        ],
      });

      // console.log('finalResult : ',finalResult);
      const finalFunctionCalls = finalResult.functionCalls
      console.log('functionCalls again ? : ', finalFunctionCalls);

      console.log(finalResult.text)

    } else {
      console.log('No tool calls needed response : ', response.text);

    }

  } catch (error) {
    console.log('ERROR : ', error);
  }
}

async function multipleToolsCallsPossible() {
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
        required: ["a", "b","c"],
      },
    },

    {
      name: "squareOfNum",
      description: "Calculates square of a number",
      parametersJsonSchema: {
        type: "object",
        properties: {
          number: {
            type: "number",
            description: "number whose square needs to be calculated",
          }
        },
        required: ["number"],
      },
    }, {
      name: "powerOfNum",
      description: "Calculates the result of a number raised to another number",
      parametersJsonSchema: {
        type: "object",
        properties: {
          base: {
            type: "number",
            description: "number who is used as base",
          },
          power: {
            type: "number",
            description: 'Number to which base is raised'
          }
        },
        required: ["base","power"],
      },
    }
  ]

  try {
    const userQuery = `Calculate (2+3) then multiply that with (answer*2*2) then lets call this temp then for 5 times do temp=(temp)^2,and also tell me full form of ai in few words`
    console.log('userQuery : ',userQuery);
    
    let functionCalls;
    let queries = [{
      role: "user",
      parts: [{ text: userQuery }]
    }]
    let cnt=-1;
    do {
      cnt++;

      const response = await ai.models.generateContent({
        contents: queries,
        model: 'gemini-2.0-flash',
        config: {
          tools: [{
            functionDeclarations: tools
          }
          ]
        }
      });
      // console.log('response : ',response);
      

      functionCalls = response.functionCalls

      if (functionCalls && functionCalls.length != 0) {
        const functionResponses = []

        queries.push(response.candidates[0].content)

        for (let i = 0; i < functionCalls.length; i++) {
          const { args, name } = functionCalls[i]
          console.log('name of the function call : ', name);
          console.log('args for the function call : ', args);
          let result = 'unknown_tool';

          if (name == 'calculateSum') {
            result = calculateSum(args.a, args.b)
          } else if (name == 'calculateProduct') {
            result = calculateProduct(args.a, args.b, args.c)
          }  else if (name == 'squareOfNum') {
            result = squareOfNum(args.number)
          }else if (name == 'powerOfNum') {
            result = powerOfNum(args.base,args.power)
          }

          functionResponses.push({
            functionResponse: {
              name,
              response: { result }
            }
          });
        }

        queries.push({
          role:'user',
          parts:functionResponses
        })

      } else {
        console.log('No tool calls needed response : ', response.text);
      }
      console.log('--------------------------');
      
    } while (functionCalls && functionCalls.length != 0)
    console.log('No of tool calls made : ',cnt);
  } catch (error) {
    console.log('ERROR : ',error);
    
  }
  
}

// worker()
multipleToolsCallsPossible()