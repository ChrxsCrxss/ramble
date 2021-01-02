require("dotenv").config();
import fetch from "node-fetch";
import cheerio from "cheerio";
import recommendationCard from "../models/recommendationCard";

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
 * The current implementation is so unperformant that it is not viable.
 * A user could have to wait an excuriating 30 seconds or more to recieve recommendations.
 * Caching will help, but we need to perform more aysnc operations in parallel and await
 * multiple promises. We could also have an in-house
 * Optimizations: (1) unix sockets,
 *                (2) await multiple promises,
 *                (3) caching top keyword urls
 */
export default async function scrapeSEP(queryStrings, REDIS_CLIENT) {
  /* PHASE ONE */
  for (let queryString of queryStrings) {
    console.log(queryString);
    const SEP_SEARCH_ENDPOINT = `https://plato.stanford.edu/search/search?query=`;
    const response = await fetch(`${SEP_SEARCH_ENDPOINT}${queryString}`, {});

    const body = await response.text();

    let $ = cheerio.load(body);

    const SEP_ARTICLE_URL_ENDPOINT = `https://plato.stanford.edu/entries/`;
    const SEP_URLS = $(".result_url")
      // First get the text. This returns a string, with each
      // url seperated by a newline character
      .text()

      // Next, split on the newline character to produce an
      // array of urls
      .split("\n")

      // Finally, filter out extraneous elements
      .filter((url) => url.includes(SEP_ARTICLE_URL_ENDPOINT));

    for (const url of SEP_URLS) {
      const response = await REDIS_CLIENT.zaddAsync(
        "sep_url_sset",
        "INCR",
        "1",
        url
      );
    }
  }

  /* PHASE TWO */

  // Return a sorted list of elements in the set
  const response = await REDIS_CLIENT.zrevrangeAsync("sep_url_sset", 0, -1);

  // After each round of processing urls, the key needs to be deleted so
  // that each round begins afresh
  REDIS_CLIENT.delAsync("sep_url_sset");

  const topUrls = response.slice(0, 20);

  const recommendationCardContents: recommendationCard[] = [];

  for (const topUrl of topUrls) {
    const response = await fetch(topUrl, {});

    const body = await response.text();

    let $ = cheerio.load(body);

    recommendationCardContents.push({
      title: $("title")
        .text()
        .replace("\n", "")
        .replace("(Stanford Encyclopedia of Philosophy)", ""),
      intro: $("#preamble p").text().replace("\n", ""),
      url: topUrl,
    });
  }

  return recommendationCardContents;
}
