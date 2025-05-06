import { call, CLI, printTable, run } from "@christianjuth/ts-cli-generator";
import "isomorphic-fetch";
import { open } from "openurl";

type Article = {
  title: string | null;
  pubDate: string | null;
  link: string | null;
  author: string | null;
  description: string | null;
};

async function fetchJson<T = any>(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text) as T;
}

function fetchRssAsJson(url: string) {
  return fetchJson<{ items: Article[] }>(
    `https://api.rss2json.com/v1/api.json?rss_url=${url}`
  );
}

const formatText = (html: string) =>
  html
    .replace(/\n/gi, "")
    .replace(/<\/\s*(?:p|div)>/gi, " ")
    .replace(/<br[^>]*\/?>/gi, " ")
    .replace(/<[^>]*>/gi, "")
    .replace("&nbsp;", " ")
    .replace(/[^\S\r\n][^\S\r\n]+/gi, " ")
    .replace(/(\n|\r|\n\r)+/g, "");

async function getIndex(max: number, index: number): Promise<number> {
  if (index > max) {
    console.error("Index out of range");
    return await call(getIndex)(max);
  }
  return index;
}

function getShouldOpenInBrowser(openInBrowser: boolean) {
  return openInBrowser;
}

async function selectArticle(items: Article[]) {
  console.log("Select an article");

  printTable(items.map((item, i) => [`[${i}]`, `${item.title}`]));
  const index = await call(getIndex)(items.length);
  const { title, pubDate, author, description, link } = items[index];

  printTable(
    [title, pubDate, author, " ", description]
      .filter(Boolean)
      .map((text) => [formatText(text as string)])
  );

  if (link) {
    const confirmation = await call(getShouldOpenInBrowser)();
    if (confirmation) {
      open(link);
    }
  }

  await call(selectArticle)(items);
}

async function selectNewsSource(
  source:
    | "cnn"
    | "nytimes"
    | "huffpost"
    | "usa-today"
    | "yahoo-news"
    | "npr"
    | "latimes"
) {
  let url = "";

  switch (source) {
    case "cnn":
      url = "http://rss.cnn.com/rss/cnn_topstories.rss";
      break;
    case "nytimes":
      url = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
      break;
    case "huffpost":
      url = "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml";
      break;
    case "usa-today":
      url = "http://rssfeeds.usatoday.com/UsatodaycomNation-TopStories";
      break;
    case "yahoo-news":
      url = "https://www.yahoo.com/news/rss";
      break;
    case "npr":
      url = "https://feeds.npr.org/1001/rss.xml";
      break;
    case "latimes":
      url = "https://www.latimes.com/local/rss2.0.xml";
      break;
  }

  const { items } = await fetchRssAsJson(url);

  if (items?.length === 0) {
    throw new Error(`failed to load articles form ${source}`);
  }

  await call(selectArticle)(items);
}

export const cli: CLI = {
  selectNewsSource,
};
