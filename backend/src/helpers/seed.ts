import { CredentialForm } from "../models/credential.model.js";
import { NodeAction } from "../models/node.model.js";
import { ToolForm } from "../models/tool.model.js";
import { TriggerAction } from "../models/trigger.model.js";
import { z } from 'zod'

export async function createTriggerActions() {
  const triggerActionData = [{
    name: `trigger:webhook`,
    queueName: `trigger:webhook`,
    icon: `https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png`
  }, {
    name: `trigger:manual_click`,
    queueName: `trigger:manual_click`,
    icon: `https://media.gettyimages.com/id/1974389824/vector/cursor-icon-click.jpg?s=2048x2048&w=gi&k=20&c=Vds_aGP00pVqkX58Ye5WmgsepMHj6JH_8VJziB2t3YI=`
  }, {
    name: `trigger:telegram_on_message`,
    queueName: `trigger:telegram_on_message`,
    icon: `https://imgs.search.brave.com/WFAdu672ZAB4qo1sO_7A6W5dSfBFwTefFVYh8IomlTc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni85NjQzLzk2NDM2/NTcucG5nP3NlbXQ9/YWlzX3doaXRlX2xh/YmVs`
  }]

  try {
    await TriggerAction.insertMany(triggerActionData)
    console.log('All triggeractions created successfully');

  } catch (error) {
    console.log('Failed to create the trigger actions : ', error);
  }
}

export async function createNodeActions() {
  const nodeActionData = [{
    name: `telegram_send_message`,
    queueName: `action:telegram_send_message`,
    icon: `https://i.pinimg.com/736x/29/52/b7/2952b7f67446895f8f11c3afacc89edc.jpg`,
    publicallyAvailaible: true
  }, {
    name: `gmail_send_email`,
    queueName: `action:gmail_send_email`,
    icon: `https://imgs.search.brave.com/VUh26_a7IUB9j8lXGp_piCo7z7VfCKivXVARaFeIDyA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vbEZtZWsv/TUFHWEY3bEZtZWsv/MS90bC9jYW52YS1n/cmFkaWVudC1uZW9u/LWVtYWlsLWljb24t/cmVwcmVzZW50aW5n/LW1lc3NhZ2VzLWFu/ZC1kaWdpdGFsLWNv/bW11bmljYXRpb24t/c3VpdGFibGUtZm9y/LXNvY2lhbC1tZWRp/YS1ncmFwaGljcywt/bWFya2V0aW5nLWNh/bXBhaWducywtYW5k/LWlubm92YXRpdmUt/dWktdXgtcHJvamVj/dHMtTUFHWEY3bEZt/ZWsucG5n`,
    publicallyAvailaible: true
  }, {
    name: `aiNode`,
    queueName: `action:aiNode`,
    icon: `https://imgs.search.brave.com/KkurEJTTp02R4mtOWY22R3FdvJGgAWI0V-jMGASzcM8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9haS1yb2Jv/dC0zLTEwODkzODAu/cG5nP2Y9d2VicCZ3/PTEyOA`,
    publicallyAvailaible: true,
    type: 'aiNode'
  }, {
    name: `telegram_send_message_and_wait_for_response`,
    queueName: `action:telegram_send_message`,
    icon: `https://lh3.googleusercontent.com/rd-gg-dl/AJfQ9KRgWP1ACbXvPQoMxmQxk-bltc8vZ8GCFfqEDZ3YTyxNB_rnBaEqofJZjAS3EJ4HExAQTijxZaaFbqBbTNjy5lzaV00Vh_dOQeM2oM3myjfIlHNX21RwSNcLU-6WFtlX1hFLNjjmxWcNTyZI-jSCZn3d57rm1SXrm247T2tQk5RQB0mIrc41cy529E5O1PuuoPXIJrxxtNFWwtBar_Up1MlElGDBqmxDFpt1eREAr3702q8uEOZ3kjNKy13wCVWT1AKHfF8iMp-AWJy4dXZpQ-T_HA29WCwX_HaqPUqbChJ4lNGvYgN-ccHEvQtb8qOG5Kqc8WAyV_2DQoqQtVMxDZv_ZZojbJO8ihjetA4Oog8NTzKS8K3LWfCgbVtn9OePtCeF0ZLonQQJwAGoO6C_FYx5-UXTDXWWqoY_Kg6_L0DtbYMc5kpN9Pe7qtf52JNvq5ZrM4dgJy9X7Rx6Nvf57vNnGweb5TlQiFAMRCkRL4vz-LXTsNPgrHZrlq0JT4dUU8RWiGcu34d7DelVs3axTWse9KT1k57ySmIYmOWbGBABqEBqV__TCOtHyQ6F9X-mljgum4V1grup55nlWXPb5If5MbXbjBuE0S61yCMH53FOVM_WaP5sDN0wyc6OgokMIZSnAWLS9aWUHHdPhYp1LC9NmV3KIpWutdoP1T_iDYp8Lt2-lcQ7SpdY6juryL6S1KjPLScfycGmLkPiGUC_WFg-KEm6DLqUfvwrYw6lzqE-E_kt5tCA0jefq5r14CoBksg6-6HQIFKxMri8QidL0GzR4N4ulfhvz3b28WHeBqzPJIWlBwv4GrT-QwrsQjcIB342ETf15lCFF4DNaF0YOsbAStxCl7361wqEvROe-j2DDscesbS1oHzVWHUBbHUpWL58TrPbONvRiIExB61qmZzkNdb2T63lcXPVeniWMd43FHi0eff5X_7a3Gqah8TU_jAP_ljIah3NIU9b9jf6qdfE2MUOTH2YYkQPltqmypRUt5_-WLM9eUnHwRr7AAtgbAB1J_2yaf-5oY9-IB8HeRQ8aGOTMw0Es7MR4Az4SRrrWevTrvOq_UjEd6ZH2uCZsOw0xIr56RlDj6A5EOoDtXKcFOzZ5YgNurB2BM1fejKsjzeSwEh2ooWpTb8_VnuRfC_f9zsy9fh9mMyNxv5NslPjLGIh8NN-bh6OXkZCJx2lARphnCt-EPwISaT8mvIDcbpgyh0qKLOgYrCT8lNFk9FN6SLcBrBNsTekzf_dkb_S=s1024`,
    publicallyAvailaible: true
  }]

  try {
    await NodeAction.insertMany(nodeActionData)
    console.log('All node actions created successfully');

  } catch (error) {
    console.log('Failed to create the node actions : ', error);
  }
}

export async function createCredentialForms() {
  const credentialFormsData = [{
    name: `cohere`,
    requiredFields: ["API_KEY"],
    publicallyAvailaible: true,
    type: 'llm'
  }, {
    name: `gemini`,
    requiredFields: ["API_KEY"],
    publicallyAvailaible: true,
    type: 'llm'
  }, {
    name: `gmail`,
    requiredFields: ["RESEND_API_KEY"],
    publicallyAvailaible: true,
  }, {
    name: `telegram`,
    requiredFields: ["bot_token"],
    publicallyAvailaible: true,
  }]

  try {
    await CredentialForm.insertMany(credentialFormsData)
    console.log('All credential forms created successfully');

  } catch (error) {
    console.log('Failed to create the credential forms : ', error);
  }
}

export async function createToolForm() {
  const toolFormsData = [{
    name: `serpAPI`,
    description: 'Does web serach on a given query using serpAPI and returns result',
    systemQuery:` **Tool: telegram_send_message_and_wait_for_response**

**Core Purpose:**
This tool is your DIRECT, REAL-TIME communication channel with users via Telegram. It enables bidirectional, synchronous conversations where you send a message and receive the user's response immediately.

**When You MUST Use This Tool:**
✅ When you need to ask the user ANY question
✅ When collecting information from users (name, age, email, preferences, feedback, etc.)
✅ When you need clarification or confirmation from the user
✅ When conducting interviews, surveys, or data collection tasks
✅ When having multi-turn conversations that require user input
✅ When guiding users through step-by-step processes
✅ When the workflow explicitly requires user interaction via Telegram
✅ When you need to inform the user and wait for their acknowledgment

**How This Tool Works:**
1. You call the tool with TWO parameters: chat_id and message text
2. The tool sends your message to the user's Telegram chat
3. The tool WAITS (asynchronously) for the user to respond
4. The tool returns the user's response as a string
5. You process their response and decide the next action
6. You can call this tool again to continue the conversation

**Function Signature:**
async telegram_send_message_and_wait_for_response(chat_id: string, text: string)

**Parameters:**
- chat_id: The Telegram chat ID (usually provided in the workflow context)
- text: Your message to send to the user (string)

**Returns:**
- A string containing the user's response from Telegram

**Important Technical Details:**
⚠️ This tool is ASYNCHRONOUS - it waits for user input before returning
⚠️ Always await the response before proceeding to the next step
⚠️ The chat_id is typically available in the workflow state/context
⚠️ The tool handles all Telegram API communication for you
⚠️ Responses may take seconds to minutes depending on user availability
⚠️ If the tool times out or fails, you'll receive an error message

**Conversation Flow Pattern:**
Step 1: Call tool → "Hello! What is your name?"
        Wait for response → User replies: "John"
Step 2: Process "John" in your logic
Step 3: Call tool again → "Nice to meet you, John! What's your age?"
        Wait for response → User replies: "25"
Step 4: Process "25" and continue...
Step 5: Repeat until conversation goal is achieved

**Best Practices:**
✓ Keep messages clear, concise, and conversational
✓ Ask ONE question at a time for better user experience
✓ Use friendly, natural language (emojis are fine if appropriate)
✓ Always acknowledge the user's response before asking the next question
✓ Validate user input after receiving it
✓ Handle unexpected or unclear responses gracefully
✓ Use this tool iteratively - multiple calls in sequence are expected
✓ Don't assume information - always wait for explicit user responses

**Error Handling:**
- If the tool returns an error, acknowledge it and try again
- If the user provides unclear input, use the tool again to ask for clarification
- If the tool times out, inform the user and retry

**Example Conversation (Multi-turn):**
Your Task: Collect user's name and city

Turn 1:
  You → telegram_send_message_and_wait_for_response(chat_id, "Hi! 👋 What's your name?")
  Tool Returns → "Sarah"
  
Turn 2:
  You → Process: name = "Sarah"
  You → telegram_send_message_and_wait_for_response(chat_id, "Great to meet you, Sarah! Which city are you from?")
  Tool Returns → "Mumbai"
  
Turn 3:
  You → Process: city = "Mumbai"
  You → telegram_send_message_and_wait_for_response(chat_id, "Perfect! So you're Sarah from Mumbai. Is that correct?")
  Tool Returns → "Yes!"
  
Conversation Complete ✅

**Critical Rules:**
🚫 NEVER respond directly in the chat without using this tool if the workflow requires Telegram communication
🚫 NEVER skip waiting for user response - the tool handles the waiting
🚫 NEVER assume what the user will say - always get actual responses
✅ ALWAYS use this tool when user interaction is part of your task
✅ ALWAYS validate and process user responses after receiving them
✅ ALWAYS maintain conversation context across multiple tool calls

**When NOT to Use This Tool:**
❌ When the user's query can be answered with your own knowledge
❌ When no user input is required (use other communication tools if needed)
❌ When you're performing backend operations that don't need user interaction
❌ When another tool is more appropriate for the task

**Integration with Other Tools:**
You can use this tool in combination with other tools:
- Use serpAPI to search the web, THEN use Telegram to share results with the user
- Use weather tool to fetch data, THEN use Telegram to inform the user
- Collect info via Telegram, THEN use database tools to store it

**Remember:** This tool is specifically for INTERACTIVE, CONVERSATIONAL workflows where real-time user input is essential. Use it confidently and iteratively to build natural, engaging user experiences.
`,
    schema: z.object({
      query: z.string().describe("query used by serpAPI to do web search and return result/json")
    }),
    func: async function (query: string) {
      return "Some info from the serpAPI";
    },
    publicallyAvailaible: true
  }, {
    name: `wikipedia_search`,
    description: 'Does wikipedia search',
    systemQuery:`
🔹 **Tool: wikipedia_search**

**Core Purpose:**
This tool searches Wikipedia and returns accurate, encyclopedic information on virtually any topic. Wikipedia is one of the most comprehensive and reliable sources for factual information about people, places, events, concepts, and phenomena. Use this tool when users need detailed, authoritative information from a trusted knowledge base.

**When You MUST Use This Tool:**
✅ When users ask about historical events, dates, or timelines
✅ When users ask about famous people, celebrities, scientists, leaders, or public figures
✅ When users ask about places, cities, countries, landmarks, or geographical features
✅ When users ask about concepts, theories, or academic topics
✅ When users ask "Who is...", "What is...", "When did...", "Where is..."
✅ When users want detailed explanations of scientific, technical, or specialized topics
✅ When verifying facts about well-documented subjects
✅ When users ask about movies, books, TV shows, music, or cultural phenomena
✅ When users ask about organizations, companies, or institutions
✅ When providing educational content or explanations
✅ When users explicitly ask to "look up" or "search Wikipedia" for something

**How This Tool Works:**
1. You provide a search query (string) - typically the name or topic to search
2. The tool queries Wikipedia's API
3. Wikipedia returns the most relevant article(s)
4. You receive a summary/excerpt from the article (usually 2-5 sentences)
5. You may also receive the full Wikipedia URL for reference
6. You analyze and present the information to the user naturally

**Function Signature:**
async wikipedia_search(query: string)

**Parameters:**
- query: The topic, person, place, or concept to search (e.g., "Albert Einstein", "Machine Learning", "Taj Mahal", "World War II")

**Returns:**
- A string containing:
  * Summary/excerpt from the Wikipedia article (typically first few sentences)
  * Possibly the article title
  * Possibly the Wikipedia URL for full article
  * Key factual information about the topic

**Query Best Practices:**
✓ Use specific names: "Albert Einstein" not just "Einstein"
✓ Use proper nouns and capitalization: "World War II", "United States"
✓ Use common/official names: "New York City" not "NYC"
✓ For disambiguation, be more specific: "Paris, France" vs "Paris, Texas"
✓ Use full titles for works: "The Great Gatsby" not just "Gatsby"
✓ Use scientific names when appropriate: "Canis lupus" or "wolf"
✓ Keep it concise: usually 1-4 words

**Example Queries:**
Perfect: "Quantum Computing"
Perfect: "Marie Curie"
Perfect: "Eiffel Tower"
Perfect: "Python programming language"
Perfect: "French Revolution"
Good: "Machine learning"
Good: "Taj Mahal"
Needs Refinement: "that guy who invented stuff" → Try "Thomas Edison"
Ambiguous: "Washington" → Try "George Washington" or "Washington, D.C."

**Processing Wikipedia Results:**
After receiving results:
1. Read and understand the summary provided
2. Extract the most relevant facts for the user's question
3. Present information in natural, conversational language
4. Synthesize the information - don't just copy-paste
5. Cite Wikipedia as the source when appropriate
6. If the summary doesn't fully answer the question, mention that more details are available in the full article
7. If results seem wrong or ambiguous, try refining your search query

**Response Patterns:**

**Direct Factual Query:**
User: "Who was Albert Einstein?"
You: wikipedia_search("Albert Einstein")
Results: "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity..."
Your Response: "Albert Einstein was a German-born theoretical physicist, best known for developing the theory of relativity. He's one of the most influential scientists in history and won the Nobel Prize in Physics in 1921."

**Concept Explanation:**
User: "What is machine learning?"
You: wikipedia_search("Machine Learning")
Results: "Machine learning is a field of artificial intelligence that uses statistical techniques..."
Your Response: "Machine learning is a branch of artificial intelligence that enables computers to learn from data and improve their performance without being explicitly programmed. It uses statistical techniques to identify patterns and make predictions."

**Historical Event:**
User: "Tell me about the French Revolution"
You: wikipedia_search("French Revolution")
Results: "The French Revolution was a period of radical political and societal change in France that began in 1789..."
Your Response: "The French Revolution was a major political and social upheaval in France from 1789 to 1799. It led to the end of the monarchy, significant social reforms, and had lasting impacts on modern democracy."

**Place/Landmark:**
User: "What's special about the Taj Mahal?"
You: wikipedia_search("Taj Mahal")
Results: "The Taj Mahal is an ivory-white marble mausoleum built by Mughal emperor Shah Jahan..."
Your Response: "The Taj Mahal is a stunning white marble mausoleum in Agra, India, built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. It's considered one of the finest examples of Mughal architecture and is a UNESCO World Heritage Site."

**Important Technical Details:**
⚠️ Wikipedia search returns SUMMARIES, not full articles
⚠️ Summaries are usually 2-5 sentences from the article introduction
⚠️ The tool may return disambiguation pages if query is ambiguous
⚠️ Not all topics have Wikipedia articles (very recent events, very obscure topics)
⚠️ Information is generally accurate but should be cross-referenced for critical decisions
⚠️ Wikipedia is best for factual, encyclopedic content, not opinions
⚠️ Articles are constantly updated, so information is relatively current

**Handling Ambiguous Results:**
If the search returns multiple possible matches:
1. Try a more specific query
2. Add context: "Python programming language" vs "Python snake"
3. Add location: "Paris, France" vs "Paris, Texas"
4. Add time period: "Mercury planet" vs "Mercury element"
5. Add descriptors: "Apple company" vs "Apple fruit"

**Multiple Searches for Complete Answers:**
Sometimes you need to search multiple topics:

User: "Compare Einstein and Newton"
You:
  - wikipedia_search("Albert Einstein") → Get Einstein info
  - wikipedia_search("Isaac Newton") → Get Newton info
Your Response: Synthesized comparison of both scientists

**Combining Wikipedia with Your Knowledge:**
Best approach: Wikipedia for facts + Your intelligence for synthesis

User: "Why is Einstein important?"
You: wikipedia_search("Albert Einstein")
Then: Use Wikipedia facts + your understanding to explain significance
Response: "Einstein revolutionized physics with his theory of relativity [from Wikipedia], which changed our understanding of space, time, and gravity. His work laid the foundation for modern physics and technologies like GPS [your synthesis]."

**Contextual Usage Examples:**

**Scenario 1: Educational Query**
User: "I need to write an essay about photosynthesis. What is it?"
You: wikipedia_search("Photosynthesis")
Results: "Photosynthesis is a process used by plants and other organisms to convert light energy..."
Response: "Photosynthesis is the process by which plants convert sunlight into chemical energy (glucose). Plants use chlorophyll to capture light energy, which then converts carbon dioxide and water into glucose and oxygen. This is the fundamental process that sustains most life on Earth!"

**Scenario 2: Historical Research**
User: "When was the Declaration of Independence signed?"
You: wikipedia_search("United States Declaration of Independence")
Results: "The Declaration of Independence was signed on July 4, 1776..."
Response: "The Declaration of Independence was signed on July 4, 1776, in Philadelphia. This document declared the thirteen American colonies independent from British rule."

**Scenario 3: Celebrity/Public Figure**
User: "Tell me about Elon Musk"
You: wikipedia_search("Elon Musk")
Results: "Elon Musk is a business magnate and investor, known for founding SpaceX, Tesla..."
Response: "Elon Musk is a prominent entrepreneur and business leader. He's the CEO of Tesla (electric vehicles), founder of SpaceX (space exploration), and has been involved in numerous innovative ventures including Neuralink and The Boring Company."

**Scenario 4: Scientific Concept**
User: "What are black holes?"
You: wikipedia_search("Black hole")
Results: "A black hole is a region of spacetime where gravity is so strong that nothing can escape..."
Response: "A black hole is a region in space where gravity is so incredibly strong that nothing, not even light, can escape once it crosses the event horizon. They're formed when massive stars collapse at the end of their life cycle."

**Scenario 5: Cultural Topic**
User: "What's the story behind the Mona Lisa?"
You: wikipedia_search("Mona Lisa")
Results: "The Mona Lisa is a portrait painting by Leonardo da Vinci, painted between 1503-1519..."
Response: "The Mona Lisa is arguably the world's most famous painting, created by Leonardo da Vinci between 1503-1519. It's a portrait believed to be of Lisa Gherardini, and is known for the subject's enigmatic smile. It's housed in the Louvre Museum in Paris."

**Error Handling:**
- **No results found**: "I couldn't find a Wikipedia article for that. Could you be more specific or rephrase?"
- **Disambiguation page**: "There are multiple topics with that name. Did you mean [option 1] or [option 2]?"
- **Very brief results**: "Wikipedia has limited information on this. Let me try [alternative source/tool]."
- **Tool failure**: "I'm having trouble accessing Wikipedia right now. Let me try again or use my own knowledge."
- **Outdated info**: "This Wikipedia info might not be current. Let me also check [serpAPI] for recent updates."

**Combining with Other Tools:**

**Wikipedia + SerpAPI:**
User: "Tell me about iPhone 15 and its current price"
You: 
  - wikipedia_search("iPhone 15") → Get technical specs and background
  - serpAPI("iPhone 15 price 2025") → Get current pricing
Response: Combined factual background + current market info

**Wikipedia + Telegram:**
User wants information delivered via Telegram
You:
  - wikipedia_search("Quantum Physics")
  - telegram_send_message_and_wait_for_response(chat_id, summary_from_wikipedia)

**Wikipedia + Weather:**
User: "Tell me about Mumbai and its current weather"
You:
  - wikipedia_search("Mumbai") → City background
  - fetch_weather("Mumbai") → Current conditions
Response: "Mumbai is India's largest city and financial capital [Wikipedia]. Currently, it's 28°C with humid conditions [weather tool]."

**Best Practices:**
✓ Use Wikipedia for well-established facts, not breaking news
✓ Synthesize information in your own words, don't just quote
✓ Cite Wikipedia as your source when appropriate
✓ Combine Wikipedia facts with your reasoning for richer answers
✓ Use specific search terms for better results
✓ If first search is unclear, refine and search again
✓ Acknowledge when Wikipedia has limited information
✓ Cross-reference with other tools for current events

**Quality Assessment:**
✓ Wikipedia is excellent for: History, science, geography, biographies, concepts
✓ Wikipedia is good for: Events (if not too recent), culture, technology basics
✓ Wikipedia is limited for: Very recent events, local news, product pricing, personal opinions
✓ Wikipedia is not ideal for: Real-time data, subjective topics, very niche subjects

**Critical Rules:**
✅ ALWAYS use this tool when users ask factual questions about established topics
✅ ALWAYS search for specific names/terms rather than vague descriptions
✅ ALWAYS synthesize and explain information, don't just regurgitate
✅ ALWAYS acknowledge Wikipedia as your source when using its information
✅ ALWAYS refine your query if first search doesn't yield good results
🚫 NEVER claim Wikipedia information as your own original knowledge
🚫 NEVER use Wikipedia for real-time or very recent information (use serpAPI instead)
🚫 NEVER blindly trust controversial or disputed Wikipedia content
🚫 NEVER use Wikipedia for medical or legal advice (acknowledge limitations)
🚫 NEVER search for private individuals or non-notable topics

**When NOT to Use This Tool:**
❌ For very recent news or events (use serpAPI instead)
❌ For current prices, stocks, or real-time data (use specialized tools)
❌ For weather information (use fetch_weather)
❌ For personal opinions or subjective recommendations
❌ For information you confidently know from your training
❌ For mathematical calculations (use your own capabilities)
❌ For private individuals or non-public figures

**Topic Categories Where Wikipedia Excels:**
✅ Historical Events & Periods
✅ Scientific Concepts & Theories
✅ Famous People & Biographies
✅ Countries, Cities & Landmarks
✅ Companies & Organizations (established ones)
✅ Books, Movies, Music & Art
✅ Inventions & Technology (foundational)
✅ Academic & Educational Topics
✅ Animals, Plants & Natural World
✅ Sports, Games & Recreation

**Advanced Usage Patterns:**

**Deep Dive Research:**
User asks complex question requiring multiple perspectives
You:
  1. wikipedia_search("Main Topic") → Foundation
  2. wikipedia_search("Related Topic 1") → Context
  3. wikipedia_search("Related Topic 2") → Additional context
  4. Synthesize all information into comprehensive answer

**Fact Verification:**
User makes a claim you're uncertain about
You: wikipedia_search("Relevant Topic")
Verify claim against Wikipedia facts
Provide corrected or confirmed information

**Educational Support:**
Student asks homework-type question
You: wikipedia_search("Topic")
Extract key facts and explain in student-friendly language
Encourage them to read the full Wikipedia article for more details

**Comparative Analysis:**
User asks to compare two things
You:
  - wikipedia_search("Item 1")
  - wikipedia_search("Item 2")
  - Compare and contrast based on retrieved information

**Remember:** Wikipedia is one of humanity's greatest knowledge resources. It's particularly valuable for factual, encyclopedic information about established topics. Use it confidently for historical facts, scientific concepts, biographies, and educational content. Always synthesize and explain the information rather than just repeating it verbatim. Combine Wikipedia's factual foundation with your analytical capabilities to provide comprehensive, insightful responses that truly help users understand complex topics
    `,
    schema: z.object({
      topicName: z.string().describe("Name of the topic tio be searched on wikipedia")
    }),
    func: async function (topicName: string) {
      return "Some info from the wikipedia";
    },
    publicallyAvailaible: true
  }, {
    name: `fetch_weather`,
    description: 'Fetched live weather of a city',
    systemQuery:` **Tool: fetch_weather**

**Core Purpose:**
This tool fetches LIVE, REAL-TIME weather data for any specified city in the world. It provides current temperature, weather conditions, and atmospheric information. Use this whenever users ask about weather or when weather data is needed for decision-making.

**When You MUST Use This Tool:**
✅ When users ask "What's the weather in [city]?"
✅ When users ask about current temperature, conditions, or forecast
✅ When making weather-dependent recommendations (clothing, activities, travel)
✅ When users ask "Should I bring an umbrella?" or similar weather-related questions
✅ When planning outdoor activities or events
✅ When users ask about climate in a specific location
✅ When comparing weather between multiple cities
✅ When weather data is needed for contextual decision-making

**How This Tool Works:**
1. You provide a city name as input (string)
2. The tool queries a live weather API
3. The API returns current weather data for that city
4. You receive weather information as a formatted string
5. You interpret and present the data to the user naturally

**Function Signature:**
async fetch_weather(cityName: string)

**Parameters:**
- cityName: Name of the city (e.g., "Mumbai", "New York", "Tokyo", "London")

**Returns:**
- A string containing weather information including:
  * Current temperature (likely in Celsius or Fahrenheit)
  * Weather conditions (sunny, cloudy, rainy, etc.)
  * Possibly humidity, wind speed, feels-like temperature
  * Additional atmospheric data

**City Name Best Practices:**
✓ Use common city names: "Mumbai", "Delhi", "New York"
✓ Major cities work best: "London", "Paris", "Tokyo"
✓ Use city names in English when possible
✓ For cities with same names, you might need to specify country if errors occur
✓ Capital cities and major metros have best coverage

**Example Inputs:**
Good: "Mumbai"
Good: "New York"
Good: "London"
Good: "Tokyo"
Good: "San Francisco"
Potentially Ambiguous: "Paris" (France? Texas? - but usually defaults to major city)
Bad: "My hometown" (not specific)
Bad: "Near the beach" (not a city name)

**Processing Weather Data:**
After receiving results:
1. Parse the temperature and conditions
2. Interpret what it means practically (hot, cold, comfortable)
3. Consider the context of the user's question
4. Provide relevant recommendations if appropriate
5. Present information in natural, conversational language

**Response Patterns:**

**Simple Query:**
User: "What's the weather in Mumbai?"
You: fetch_weather("Mumbai")
Results: "28°C, partly cloudy, humidity 75%"
Your Response: "It's currently 28°C in Mumbai with partly cloudy skies and 75% humidity. It's a warm day!"

**With Recommendations:**
User: "Should I carry an umbrella in London today?"
You: fetch_weather("London")
Results: "15°C, rainy, light showers"
Your Response: "Yes, definitely bring an umbrella! It's currently 15°C in London with light rain showers."

**Comparative:**
User: "Which is warmer, Delhi or Mumbai?"
You: fetch_weather("Delhi") → "35°C, clear"
You: fetch_weather("Mumbai") → "28°C, humid"
Your Response: "Delhi is warmer at 35°C with clear skies, while Mumbai is 28°C but more humid."

**Important Technical Details:**
⚠️ This tool fetches CURRENT weather, not forecasts (usually)
⚠️ Weather data may have slight delays (usually updates every 30-60 min)
⚠️ Not all cities may be available in the API database
⚠️ Very small towns might not have data; suggest nearby major cities
⚠️ Temperature units depend on API configuration (likely Celsius)
⚠️ Tool may return error if city is misspelled or not found

**Multiple City Queries:**
If user asks about multiple cities, call the tool multiple times:

User: "Compare weather in Mumbai, Delhi, and Bangalore"
You: 
  - fetch_weather("Mumbai") → Parse result
  - fetch_weather("Delhi") → Parse result  
  - fetch_weather("Bangalore") → Parse result
Your Response: "Here's the weather comparison: Mumbai is 28°C and humid, Delhi is 35°C and dry, while Bangalore is a pleasant 24°C with cloudy skies."

**Contextual Usage Examples:**

**Scenario 1: Travel Planning**
User: "I'm traveling to Paris tomorrow. What should I pack?"
You: fetch_weather("Paris")
Results: "12°C, rainy, windy"
Response: "Paris is currently 12°C with rain and wind. Pack warm layers, a raincoat, and an umbrella!"

**Scenario 2: Activity Planning**
User: "Is it good weather for a beach day in Miami?"
You: fetch_weather("Miami")
Results: "30°C, sunny, clear skies"
Response: "Perfect beach weather! Miami is 30°C with sunny, clear skies. Don't forget sunscreen!"

**Scenario 3: General Curiosity**
User: "How's the weather in Tokyo right now?"
You: fetch_weather("Tokyo")
Results: "18°C, partly cloudy"
Response: "Tokyo is currently 18°C with partly cloudy conditions. Pretty comfortable!"

**Scenario 4: Decision Support**
User: "Should I go for a run outside in Chicago?"
You: fetch_weather("Chicago")
Results: "2°C, snowing, windy"
Response: "It's quite cold at 2°C with snow and wind in Chicago. You might want to hit the gym instead, or bundle up really well!"

**Error Handling:**
- If city not found: "I couldn't find weather data for that city. Could you try a nearby major city?"
- If tool fails: "I'm having trouble fetching weather data right now. Let me try again."
- If ambiguous city: "There are multiple cities with that name. Could you specify the country?"
- If misspelling suspected: "Did you mean [corrected city name]? Let me check that."

**Combining with Other Tools:**

**With serpAPI:**
User: "What's the weather and latest news in Mumbai?"
You: fetch_weather("Mumbai") + serpAPI("Mumbai news today")
Response: Combined weather + news summary

**With Telegram:**
User workflow requires sending weather updates via Telegram
You: fetch_weather("London")
Then: telegram_send_message_and_wait_for_response(chat_id, "The weather in London is...")

**Best Practices:**
✓ Always interpret temperature in context (20°C is different in summer vs winter)
✓ Consider user's location when giving recommendations
✓ Add practical advice based on conditions
✓ Use natural language: "It's quite cold" rather than just "5°C"
✓ Acknowledge if weather is unusual: "Surprisingly cool for this time of year"
✓ Be helpful with suggestions: "Good weather for..." or "You'll need..."

**Advanced Usage:**
- Track weather changes if user asks multiple times
- Compare current weather to typical climate
- Give appropriate warnings for extreme conditions
- Consider cultural context (Celsius vs Fahrenheit preferences)

**Critical Rules:**
✅ ALWAYS call this tool when weather information is requested
✅ ALWAYS interpret weather data contextually, not just raw numbers
✅ ALWAYS provide practical recommendations when relevant
✅ ALWAYS handle errors gracefully with helpful alternatives
🚫 NEVER make up weather data - always use the tool
🚫 NEVER assume weather without checking (even if it seems obvious)
🚫 NEVER ignore extreme weather warnings in the data
🚫 NEVER provide forecasts unless the tool specifically returns forecast data

**When NOT to Use This Tool:**
❌ When user asks about historical weather data
❌ When user asks about climate (long-term average, not current)
❌ When user asks about weather-related facts that don't need current data
❌ When discussing weather metaphorically or theoretically

**Temperature Interpretation Guide:**
- Below 0°C: Freezing, very cold
- 0-10°C: Cold, need warm clothing
- 10-20°C: Cool to mild, light jacket weather
- 20-25°C: Pleasant, comfortable
- 25-30°C: Warm to hot
- 30-35°C: Hot, stay hydrated
- Above 35°C: Very hot, extreme heat precautions

**Remember:** Weather impacts many daily decisions. Provide accurate, real-time data and thoughtful recommendations that help users plan their day effectively. Always fetch fresh data rather than relying on assumptions.
`,
    schema: z.object({
      cityName: z.string().describe("Name of the city whose weather needs to be fetched")
    }),
    func: async function (cityName: string) {
      return "Some temperature";
    },
    publicallyAvailaible: true
  }, {
    name: `telegram_send_message_and_wait_for_response`,
    description: 'Sends message to the user on telegram using chat_id and message we want to send',
    systemQuery:`**Tool: telegram_send_message_and_wait_for_response**

**Core Purpose:**
This tool is your DIRECT, REAL-TIME communication channel with users via Telegram. It enables bidirectional, synchronous conversations where you send a message and receive the user's response immediately.

**When You MUST Use This Tool:**
✅ When you need to ask the user ANY question
✅ When collecting information from users (name, age, email, preferences, feedback, etc.)
✅ When you need clarification or confirmation from the user
✅ When conducting interviews, surveys, or data collection tasks
✅ When having multi-turn conversations that require user input
✅ When guiding users through step-by-step processes
✅ When the workflow explicitly requires user interaction via Telegram
✅ When you need to inform the user and wait for their acknowledgment

**How This Tool Works:**
1. You call the tool with TWO parameters: chat_id and message text
2. The tool sends your message to the user's Telegram chat
3. The tool WAITS (asynchronously) for the user to respond
4. The tool returns the user's response as a string
5. You process their response and decide the next action
6. You can call this tool again to continue the conversation

**Function Signature:**
async telegram_send_message_and_wait_for_response(chat_id: string, text: string)

**Parameters:**
- chat_id: The Telegram chat ID (usually provided in the workflow context)
- text: Your message to send to the user (string)

**Returns:**
- A string containing the user's response from Telegram

**Important Technical Details:**
⚠️ This tool is ASYNCHRONOUS - it waits for user input before returning
⚠️ Always await the response before proceeding to the next step
⚠️ The chat_id is typically available in the workflow state/context
⚠️ The tool handles all Telegram API communication for you
⚠️ Responses may take seconds to minutes depending on user availability
⚠️ If the tool times out or fails, you'll receive an error message

**Conversation Flow Pattern:**
Step 1: Call tool → "Hello! What is your name?"
        Wait for response → User replies: "John"
Step 2: Process "John" in your logic
Step 3: Call tool again → "Nice to meet you, John! What's your age?"
        Wait for response → User replies: "25"
Step 4: Process "25" and continue...
Step 5: Repeat until conversation goal is achieved

**Best Practices:**
✓ Keep messages clear, concise, and conversational
✓ Ask ONE question at a time for better user experience
✓ Use friendly, natural language (emojis are fine if appropriate)
✓ Always acknowledge the user's response before asking the next question
✓ Validate user input after receiving it
✓ Handle unexpected or unclear responses gracefully
✓ Use this tool iteratively - multiple calls in sequence are expected
✓ Don't assume information - always wait for explicit user responses

**Error Handling:**
- If the tool returns an error, acknowledge it and try again
- If the user provides unclear input, use the tool again to ask for clarification
- If the tool times out, inform the user and retry

**Example Conversation (Multi-turn):**
Your Task: Collect user's name and city

Turn 1:
  You → telegram_send_message_and_wait_for_response(chat_id, "Hi! 👋 What's your name?")
  Tool Returns → "Sarah"
  
Turn 2:
  You → Process: name = "Sarah"
  You → telegram_send_message_and_wait_for_response(chat_id, "Great to meet you, Sarah! Which city are you from?")
  Tool Returns → "Mumbai"
  
Turn 3:
  You → Process: city = "Mumbai"
  You → telegram_send_message_and_wait_for_response(chat_id, "Perfect! So you're Sarah from Mumbai. Is that correct?")
  Tool Returns → "Yes!"
  
Conversation Complete ✅

**Critical Rules:**
🚫 NEVER respond directly in the chat without using this tool if the workflow requires Telegram communication
🚫 NEVER skip waiting for user response - the tool handles the waiting
🚫 NEVER assume what the user will say - always get actual responses
✅ ALWAYS use this tool when user interaction is part of your task
✅ ALWAYS validate and process user responses after receiving them
✅ ALWAYS maintain conversation context across multiple tool calls

**When NOT to Use This Tool:**
❌ When the user's query can be answered with your own knowledge
❌ When no user input is required (use other communication tools if needed)
❌ When you're performing backend operations that don't need user interaction
❌ When another tool is more appropriate for the task

**Integration with Other Tools:**
You can use this tool in combination with other tools:
- Use serpAPI to search the web, THEN use Telegram to share results with the user
- Use weather tool to fetch data, THEN use Telegram to inform the user
- Collect info via Telegram, THEN use database tools to store it

**Remember:** This tool is specifically for INTERACTIVE, CONVERSATIONAL workflows where real-time user input is essential. Use it confidently and iteratively to build natural, engaging user experiences.
`,
    schema: z.object({
      chat_id: z.string().describe("chat_id to determine unique chat from bot of telegram"),
      text: z.string().describe('Message that needs to be sent to the user via telegram')
    }),
    func: async function (chat_id: string, text: string) {
      return "message sent successfully to the given chat_id";
    },
    icon: "http://lh3.googleusercontent.com/rd-gg-dl/AJfQ9KSv86aHTcTqvTm8kDjJA-FIXmn2vGQ7Ss_w25PRma3EH0h536nGXJpoa0OtURWycVJFk_z6f4KtUelI8aUncyz8sGbsxFVF45ZFJEcGluafM7ybWdMQ97MfogW5LxOfjP9UFp0G0Ndl-ev7Szqd5OlcGYVjSCM8IBC5U4_08zJ1Ejf9BN1vXv4GhU30DcxQ4zZrKUpuWqhOtjuQR2BSozRD_S85olzVWowkqIDJiP3hwjv8uZdsSxWnwgxtnj_S7sSyYcmXhpYv5M3N2GArU8k3BritahitJFDqv0RI2bO-B_VLPDv0Gj5kq62FDVc7M6QwashGHTDmqulP4zPXPIbdl33Hc3QdXRiK7SkcvZspkX7Pu6BDmjuSUxCr67x0rbjiRh_nlVrWrcI22W_TCnWcmi88cOiQxuIoCTfkK_OTVynwVJ-3HjWm4bzbVgqLukQQKOE-ku-LUANuq0TRDSxJRs82-jhRxkcagubzBZUqDWvVJorbAJ_y3FkTN_O9SNb2knZF48Qo1q5drm03LgUOvL9msLIClHKMq_Th7d8cRYD7v3GwIW7LtmpYShpcG2lPXpB-lnAQWIf_BdW_ldG79jLi_dVmkyRJyn-eu7e_ZlieOhy5b9TUMfsReF9fjoNEQazS32cZkmyJYMHl21nFEHP6blGipTLHl08eOXL8OvF-_P712p0MyaRwCjqEC-rQuy4SsP4t_3lYFnWQvLXlUcRfIKRYUxR8rao91OgfHcv5s7bLqkqYCP57fjG0sQQj4pi5WLI36qn9mbirs1l7fRpj8mUNQf-FeIOOjbkuLThrOCgmaH-tUDUYZZmrjWPkxniyOrXQ9LUt3Ba87QCKTu1eCQBEA28b8BCOiJTQPnFjT16nJAHVnrDns5qkyVnsxPaDxeBMHKmeLxuc-SLBYtv_aaeYdrY59-j_vzh22lIJvOqR0WLAdjAqgH6ajO7UH5Hs6ODOTtwp7GX4hflK0olRE9H8BYkIG1j6p7ItOe1J2YxHGV1UlllQEsP3Ap5DXHB7uIuCphmf0BEORwpdgc-NrrmQtgslrkx5lPfoePrSe7NMicT_IKo50GdzJRUCa-iXcTkhEjEC-XeVGawgFAykLjkHnwBKbvpMtn6tg2xLBRuv3QYNJXiGZtFPZwLWlcIz1k0BAFlmdLMbHckdNNkgNPrCKycG_eCiHEDtHIQqO6dR81msqAt-NxpNPx1AaQCaPFrWMFJX9Geew2okbq-y7DOihdey72Kczb9F=s1024",
    publicallyAvailaible: true
  }]

  try {
    await ToolForm.insertMany(toolFormsData)
    console.log('All tool forms created successfully');

  } catch (error) {
    console.log('Failed to create the tool forms : ', error);
  }
}