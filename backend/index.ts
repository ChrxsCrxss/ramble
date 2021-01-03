require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";

/**
 * In order to use async/wait syntax, we promisify
 * asynchronous redis operations using bluebird
 */
import bluebird from "bluebird";
import redis from "redis";
import StanfordEncyScraper from "./src/services/SEPScraper";
import recommendationCard from "./src/models/recommendationCard";
import InternetEncyPhilScraper from "./src/services/IEPScraper";
import WikiScraper from "./src/services/WikiScraper";

// configure express instance
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/recommendations", async (req, res) => {
  console.log(req.body.scrapeList);

  // First, grab the user input from the http request body
  const TextInput = req.body.textInput.content;
  const sentences: string[] = TextInput.split(/[\\.!?]/)
    .map((sentence: string) => sentence.replace(/[^a-z0-9+]+/gi, "+"))
    .map((sentence: string) =>
      sentence[0] === "+" ? sentence.substring(1) : sentence
    )
    .filter((sentence: string) => sentence.length > 1);

  const recommendations: recommendationCard[] = [];

  const wikiScraper = new WikiScraper();
  wikiScraper.scracpe(sentences);

  //   if (req.body.scrapeList.includeSEP) {
  //     try {
  //       const stanfordEncyScraper = new StanfordEncyScraper();
  //       const stanfordRecommendations: recommendationCard[] = await stanfordEncyScraper.scrape(
  //         sentences
  //       );
  //       recommendations.push(...stanfordRecommendations);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  // if (req.body.scrapeList.includeIEP) {
  //   const internetEncyPhilScraper = new InternetEncyPhilScraper();
  //   try {
  //     internetEncyPhilScraper.scrape(sentences);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  res.send(recommendations);
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
