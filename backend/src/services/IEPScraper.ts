const scrapeIEP = async (sentences) => {
  const API_KEY = process.env.API_KEY;
  const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
  const GOOGLE_CUSTOMSEARCH_URL = `https://www.googleapis.com/customsearch/v1`;

  for (const sentence of sentences) {
    const query = `${GOOGLE_CUSTOMSEARCH_URL}?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${sentence}`;

    const response = await fetch(query);

    const results = await response.json();

    console.log(results.items);
  }
};
