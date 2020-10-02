require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const scrapeSEP = require('./src/WebScrapers/SEPScraper.js');

/**
 * In order to use async/wait syntax, we promisify
 * asynchronous redis operations using bluebird 
 */
const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//configure redis client on port 6379
const port_redis = process.env.PORT || 6379;
const redis_client = redis.createClient(port_redis);

// configure express instance
const app = express();
app.use(bodyParser.json());
app.use(cors());

let responseIsEmpty = (res) => !res || res.length === 0;

const scrapeIEP = async (sentences) => {

    const API_KEY = process.env.API_KEY;
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
    const GOOGLE_CUSTOMSEARCH_URL = `https://www.googleapis.com/customsearch/v1`; 

    for (const sentence of sentences) {
        const query = `${GOOGLE_CUSTOMSEARCH_URL}?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${sentence}`;

        const response = await fetch(query);

        const x = await response.json()
        console.log(x);
    }
}


app.post('/recommendations', async (req, res) => {

    console.log(req.body.scrapeList);

    // First, grab the user input from the http request body
    const TextInput = req.body.textInput.content;
    const sentences = TextInput.split(/[\\.!?]/)
        .map( sentence => sentence.replace(/[^a-z0-9+]+/gi, '+')
        )
        .map( sentence => sentence[0] === '+' ? sentence.substring(1) : sentence 
        )
        .filter( sentence => sentence.length > 1);


    const recommendations = [];


    // if (req.body.scrapeList.includeSEP) {

    //     try {
    //         const stanfordRecommendation = await scrapeSEP.scraper(sentences, redis_client); 
    //         recommendations.push(...stanfordRecommendation); 
    //     } catch (error) {
    //         console.log(error)
    //     }  

    // }

    if (req.body.scrapeList.includeIEP) {
        scrapeIEP(sentences); 
    }



    res.send(recommendations);

});


app.listen(4000, () => {
    console.log('listening on port 4000');
})