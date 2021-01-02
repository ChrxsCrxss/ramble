import recommendationCard from "../models/recommendationCard";
import RedisDAO from "./RedisDAO";
import fetch from "node-fetch";
import cheerio from "cheerio";
import { cacheService } from "../interfaces";

export default class InternetEncyPhilScraper {
  private cache: cacheService = new RedisDAO();
  private API_KEY = process.env.API_KEY;
  private SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
  private GOOGLE_CUSTOMSEARCH_URL = `https://www.googleapis.com/customsearch/v1`;

  public scrape = async (queries: string[]): Promise<recommendationCard[]> => {
    console.log("here");
    for (const query of queries) {
      const returned = `${this.GOOGLE_CUSTOMSEARCH_URL}?key=${this.API_KEY}&cx=${this.SEARCH_ENGINE_ID}&q=${query}`;

      console.log("here");

      let results: any;

      try {
        const response = await fetch(returned);
        results = await response.json();
      } catch (err) {
        console.log(err);
      }

      for (const item of results.items) {
        const { link }: { link: string } = item;
        this.cache.addItem(link);
      }
    }

    // Return a sorted list of elements in the set
    const response = await this.cache.getSortedSet();

    // After each round of processing urls, the key needs to be deleted so
    // that each round begins afresh
    this.cache.clearCache();

    const topUrls = response.slice(0, 20);

    const recommendationCardContents: recommendationCard[] = [];

    for (const topUrl of topUrls) {
      const response = await fetch(topUrl, {});

      const body = await response.text();

      let $ = cheerio.load(body);

      console.log($("p").slice(0, 2).text());

      recommendationCardContents.push({
        title: $(".entry-point h1").text(),
        intro: $("p").slice(0, 2).text(),
        url: topUrl,
      });
    }

    return recommendationCardContents;
  };
}

// export async function scrapeIEP(sentences: string[]) {
//   const API_KEY = process.env.API_KEY;
//   const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
//   const GOOGLE_CUSTOMSEARCH_URL = `https://www.googleapis.com/customsearch/v1`;

//   for (const sentence of sentences) {
//     const query = `${GOOGLE_CUSTOMSEARCH_URL}?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${sentence}`;

//     const response = await fetch(query);

//     const results = await response.json();

//     for (const items of results.items) {
//     }

//     console.log(results.items);
//   }
// }
