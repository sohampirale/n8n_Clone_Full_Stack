export const toolFunctionMap = new Map([
    ['fetch_weather',async function(cityName:string){return (24+(Math.random()*10));}],
    ['serpAPI',async function(query:string){
        return {
            message:`data fetched by serpApi for query : ${query},it is a school created by harkirat singh sir for enginnering students`
        }
    }],
    ['wikipedia_search',async function(topicName:string){return `data from wikipedia about topic ${topicName},it is a school for enginnering students satrted by great developer `}]
])