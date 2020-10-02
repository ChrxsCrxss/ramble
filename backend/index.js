require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const KeyWordExtractor = require('./src/keywordExtractor');
const fetch = require('node-fetch');
const cheerio = require('cheerio');


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
    const GOOGLE_CUSTOMSEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

    for (const sentence of sentences) {
        const query = `${GOOGLE_CUSTOMSEARCH_URL}
                        ?key=${API_KEY}
                        &cx=${SEARCH_ENGINE_ID}
                        &q=${sentence.replace('', '+')}`;


        const reponse = await fetch(query);

        console.log(response);
    }

}

const scrapeSEP = async (sentences) => {
    // Fill in code here
};

app.post('/recommendations', async (req, res) => {

    // First, grab the user input from the http request body
    console.log(req.body.scrapeList);
    const TextInput = req.body.textInput.content;
    // console.log(`Raw http body:\n${TextInput}`);

    // Next, clean the user input to remove stopwords and punctuation 
    const keywords = KeyWordExtractor.getKeywords(TextInput);
    // console.log(`keywords:\n${[...keywords]}`);

    const sentences = TextInput.split(/[\\.!?]/)
        .map( sentence => sentence.replace(/[^a-z0-9+]+/gi, '+')
        )
        .map( sentence => sentence[0] === '+' ? sentence.substring(1) : sentence 
        );

    console.log(sentences)

    /**
     * The strategy for crawling the Stanford Encyclopedia of Philosophy (SEP) has
    * two phases:
    * 
    * PHASE 1: 
    * Send a request to the SEP search endpoint for each unique keyword. Each request
    * will return the top ten suggested articles for that keyword. Those ten suggestions
    * are then cached in a sorted set in Redis. 
    * 
    * PHASE 2: 
    * After all the keywords have been queried against the SEP search endpoint, the top
    * urls need to be scraped to gather content for recommendation cards.
    * 
    * The current implementatino is not performant, as each request must wait for the one
    * before it to complete. 
    * 
    * UPDATE: In fact, the current implementation is so unperformant that it is not viable.
    * A user could have to wait an excuriating 30 seconds or more to recieve recommendations. 
    * Caching will help, but we need to perform more aysnc operations in parallel and await
    * multiple promises. We could also have an in-house 
    * Optimizations: (1) unix sockets, 
    *                (2) await multiple promises, 
    *                (3) caching top keyword urls 
    */


    /* PHASE ONE */

    const SEP_SEARCH_ENDPOINT = `https://plato.stanford.edu/search/search?query=`;
    for (let keyword of keywords) {

        const response = await fetch(`${SEP_SEARCH_ENDPOINT}${keyword}`);

        const body = await response.text();

        let $ = cheerio.load(body);

        const SEP_ARTICLE_URL_ENDPT = `https://plato.stanford.edu/entries/`;
        const SEP_URLS = $('.result_url')

            // First get the text. This returns a string, with each
            // url seperated by a newline character 
            .text()

            // Next, split on the newline character to produce an 
            // array of urls
            .split('\n')

            // Finally, filter out extraneous elements 
            .filter(url => url.includes(SEP_ARTICLE_URL_ENDPT));


        // console.log(SEP_URLS);

        for (url of SEP_URLS) {
            const response = await redis_client.zaddAsync('url_sset', 'INCR', '1', url);
        }

    }

    /* PHASE TWO */

    // Return a sorted list of elements in the set 
    const response = await redis_client.zrevrangeAsync('url_sset', 0, -1);

    // After each round of processing urls, the key needs to be deleted so
    // that each round begins afresh 
    redis_client.delAsync('url_sset');

    const topUrls = response.slice(0, 20);

    const recommendationCardContents = [];

    for (topUrl of topUrls) {

        const response = await fetch(topUrl);

        const body = await response.text();

        let $ = cheerio.load(body);

        recommendationCardContents.push({
            title: $("title").text().replace('\n', '').replace('(Stanford Encyclopedia of Philosophy)', ''),
            intro: $('#preamble p').text().replace('\n', ''),
            url: topUrl
        });

    }

    res.send(recommendationCardContents);

});


app.listen(4000, () => {
    console.log('listening on port 4000');
})