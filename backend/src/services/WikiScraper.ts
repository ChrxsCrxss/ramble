require("dotenv").config();
import fetch from "node-fetch";
import cheerio from "cheerio";
import recommendationCard from "../models/recommendationCard";
import { cacheService } from "../interfaces";
import RedisDAO from "../data/RedisDAO";

export default class WikiScraper {
  private cache: cacheService = new RedisDAO();
  private WIKI_SEARCH_ENDPOINT = "https://en.wikipedia.org/w/api.php?origin=*";

  public scracpe = async (queries: string[]): Promise<void> => {
    for (const query of queries) {
      let params: any = {
        action: "query",
        list: "search",
        srsearch: query,
        srwhat: "text",
        format: "json",
      };

      let queryURL = this.WIKI_SEARCH_ENDPOINT;

      Object.keys(params).forEach(
        (key) => (queryURL += "&" + key + "=" + params[key])
      );
      let response = await fetch(queryURL);

      if (response.status === 200) {
        let results = await response.json();

        let search = results.query.search;

        console.log(search);
      } else {
        console.log("cannot get wiki resource");
      }
    }
  };
}
