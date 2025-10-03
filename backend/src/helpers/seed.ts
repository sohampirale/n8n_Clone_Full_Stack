import { CredentialForm } from "../models/credential.model.js";
import { NodeAction } from "../models/node.model.js";
import { ToolForm } from "../models/tool.model.js";
import { TriggerAction } from "../models/trigger.model.js";
import {z} from 'zod'

export async function createTriggerActions() {
  // const triggerActionData = [{
  //   name: `trigger:webhook`,
  //   queueName: `trigger:webhook`,
  //   icon: `https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png`
  // }, {
  //   name: `trigger:manual_click`,
  //   queueName: `trigger:manual_click`,
  //   icon: `https://media.gettyimages.com/id/1974389824/vector/cursor-icon-click.jpg?s=2048x2048&w=gi&k=20&c=Vds_aGP00pVqkX58Ye5WmgsepMHj6JH_8VJziB2t3YI=`
  // }]

  const triggerActionData = [{
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
  // const nodeActionData = [{
  //   name: `telegram_send_message`,
  //   queueName: `action:telegram_send_message`,
  //   icon: `https://i.pinimg.com/736x/29/52/b7/2952b7f67446895f8f11c3afacc89edc.jpg`,
  //   publicallyAvailaible:true
  // }, {
  //   name: `gmail_send_email`,
  //   queueName: `action:gmail_send_email`,
  //   icon: `https://imgs.search.brave.com/VUh26_a7IUB9j8lXGp_piCo7z7VfCKivXVARaFeIDyA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vbEZtZWsv/TUFHWEY3bEZtZWsv/MS90bC9jYW52YS1n/cmFkaWVudC1uZW9u/LWVtYWlsLWljb24t/cmVwcmVzZW50aW5n/LW1lc3NhZ2VzLWFu/ZC1kaWdpdGFsLWNv/bW11bmljYXRpb24t/c3VpdGFibGUtZm9y/LXNvY2lhbC1tZWRp/YS1ncmFwaGljcywt/bWFya2V0aW5nLWNh/bXBhaWducywtYW5k/LWlubm92YXRpdmUt/dWktdXgtcHJvamVj/dHMtTUFHWEY3bEZt/ZWsucG5n`,
  //   publicallyAvailaible:true
  // }, {
  //   name: `aiNode`,
  //   queueName: `action:aiNode`,
  //   icon: `https://imgs.search.brave.com/KkurEJTTp02R4mtOWY22R3FdvJGgAWI0V-jMGASzcM8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL3ByZW1p/dW0vcG5nLTI1Ni10/aHVtYi9haS1yb2Jv/dC0zLTEwODkzODAu/cG5nP2Y9d2VicCZ3/PTEyOA`,
  //   publicallyAvailaible:true,
  //   type:'aiNode'
  // }]
 const nodeActionData = [{
    name: `telegram_send_message_and_wait_for_response`,
    queueName: `action:telegram_send_message`,
    icon: `https://lh3.googleusercontent.com/rd-gg-dl/AJfQ9KRgWP1ACbXvPQoMxmQxk-bltc8vZ8GCFfqEDZ3YTyxNB_rnBaEqofJZjAS3EJ4HExAQTijxZaaFbqBbTNjy5lzaV00Vh_dOQeM2oM3myjfIlHNX21RwSNcLU-6WFtlX1hFLNjjmxWcNTyZI-jSCZn3d57rm1SXrm247T2tQk5RQB0mIrc41cy529E5O1PuuoPXIJrxxtNFWwtBar_Up1MlElGDBqmxDFpt1eREAr3702q8uEOZ3kjNKy13wCVWT1AKHfF8iMp-AWJy4dXZpQ-T_HA29WCwX_HaqPUqbChJ4lNGvYgN-ccHEvQtb8qOG5Kqc8WAyV_2DQoqQtVMxDZv_ZZojbJO8ihjetA4Oog8NTzKS8K3LWfCgbVtn9OePtCeF0ZLonQQJwAGoO6C_FYx5-UXTDXWWqoY_Kg6_L0DtbYMc5kpN9Pe7qtf52JNvq5ZrM4dgJy9X7Rx6Nvf57vNnGweb5TlQiFAMRCkRL4vz-LXTsNPgrHZrlq0JT4dUU8RWiGcu34d7DelVs3axTWse9KT1k57ySmIYmOWbGBABqEBqV__TCOtHyQ6F9X-mljgum4V1grup55nlWXPb5If5MbXbjBuE0S61yCMH53FOVM_WaP5sDN0wyc6OgokMIZSnAWLS9aWUHHdPhYp1LC9NmV3KIpWutdoP1T_iDYp8Lt2-lcQ7SpdY6juryL6S1KjPLScfycGmLkPiGUC_WFg-KEm6DLqUfvwrYw6lzqE-E_kt5tCA0jefq5r14CoBksg6-6HQIFKxMri8QidL0GzR4N4ulfhvz3b28WHeBqzPJIWlBwv4GrT-QwrsQjcIB342ETf15lCFF4DNaF0YOsbAStxCl7361wqEvROe-j2DDscesbS1oHzVWHUBbHUpWL58TrPbONvRiIExB61qmZzkNdb2T63lcXPVeniWMd43FHi0eff5X_7a3Gqah8TU_jAP_ljIah3NIU9b9jf6qdfE2MUOTH2YYkQPltqmypRUt5_-WLM9eUnHwRr7AAtgbAB1J_2yaf-5oY9-IB8HeRQ8aGOTMw0Es7MR4Az4SRrrWevTrvOq_UjEd6ZH2uCZsOw0xIr56RlDj6A5EOoDtXKcFOzZ5YgNurB2BM1fejKsjzeSwEh2ooWpTb8_VnuRfC_f9zsy9fh9mMyNxv5NslPjLGIh8NN-bh6OXkZCJx2lARphnCt-EPwISaT8mvIDcbpgyh0qKLOgYrCT8lNFk9FN6SLcBrBNsTekzf_dkb_S=s1024`,
    publicallyAvailaible:true
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
    requiredFields:["API_KEY"],
    publicallyAvailaible:true,
    type:'llm'
  }, {
    name: `gemini`,
    requiredFields:["API_KEY"],
    publicallyAvailaible:true,
    type:'llm'
  }, {
    name: `gmail`,
    requiredFields:["RESEND_API_KEY"],
    publicallyAvailaible:true,
  }, {
    name: `telegram`,
    requiredFields:["bot_token"],
    publicallyAvailaible:true,
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
    description:'Does web serach on a given query using serpAPI and returns result',
    schema:z.object({
      query:z.string().describe("query used by serpAPI to do web search and return result/json")
    }),
    func:async function(query:string){
      return "Some info from the serpAPI";
    },
    publicallyAvailaible:true
  },{
    name: `wikipedia_search`,
    description:'Does wikipedia search',
    schema:z.object({
      topicName:z.string().describe("Name of the topic tio be searched on wikipedia")
    }),
    func:async function(topicName:string){
      return "Some info from the wikipedia";
    },
    publicallyAvailaible:true
  },{
    name: `fetch_weather`,
    description:'Fetched live weather of a city',
    schema:z.object({
      cityName:z.string().describe("Name of the city whose weather needs to be fetched")
    }),
    func:async function(cityName:string){
      return "Some temperature";
    },
    publicallyAvailaible:true
  }]

  try {
    await ToolForm.insertMany(toolFormsData)
    console.log('All tool forms created successfully');

  } catch (error) {
    console.log('Failed to create the tool forms : ', error);
  }
}