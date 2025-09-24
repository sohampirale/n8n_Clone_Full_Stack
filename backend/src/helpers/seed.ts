import { CredentialForm } from "../models/credential.model.js";
import { NodeAction } from "../models/node.model.js";
import { ToolForm } from "../models/tool.model.js";
import { TriggerAction } from "../models/trigger.model.js";
import {z} from 'zod'

export async function createTriggerActions() {
  const triggerActionData = [{
    name: `webhook`,
    queueName: `trigger:webhook`,
    icon: `https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png`
  }, {
    name: `manual_click`,
    queueName: `trigger:manual_click`,
    icon: `https://media.gettyimages.com/id/1974389824/vector/cursor-icon-click.jpg?s=2048x2048&w=gi&k=20&c=Vds_aGP00pVqkX58Ye5WmgsepMHj6JH_8VJziB2t3YI=`
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
    publicallyAvailaible:true
  }, {
    name: `gmail_send_email`,
    queueName: `trigger:gmail_send_email`,
    icon: `https://imgs.search.brave.com/VUh26_a7IUB9j8lXGp_piCo7z7VfCKivXVARaFeIDyA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vbEZtZWsv/TUFHWEY3bEZtZWsv/MS90bC9jYW52YS1n/cmFkaWVudC1uZW9u/LWVtYWlsLWljb24t/cmVwcmVzZW50aW5n/LW1lc3NhZ2VzLWFu/ZC1kaWdpdGFsLWNv/bW11bmljYXRpb24t/c3VpdGFibGUtZm9y/LXNvY2lhbC1tZWRp/YS1ncmFwaGljcywt/bWFya2V0aW5nLWNh/bXBhaWducywtYW5k/LWlubm92YXRpdmUt/dWktdXgtcHJvamVj/dHMtTUFHWEY3bEZt/ZWsucG5n`,
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
    publicallyAvailaible:true
  }, {
    name: `gemini`,
    requiredFields:["API_KEY"],
    publicallyAvailaible:true
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
    func:async function(cityName:string){
      return "Some info from the serpAPI";
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