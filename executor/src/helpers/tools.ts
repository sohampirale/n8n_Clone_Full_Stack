export const toolFunctionMap = new Map([
    ['fetch_weather',async function(cityName:string){return (24+(Math.random()*10));}],
    ['serpAPI',async function(query:string){
        return {
            message:`data fetched by serpApi for query : ${query}`
        }
    }],
    ['wikipedia_search',async function(topicName:string){return `data from wikipedia about topic ${topicName}`}]
])