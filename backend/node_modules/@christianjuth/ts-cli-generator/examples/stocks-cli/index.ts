import { call, CLI, printTable, run } from "@christianjuth/ts-cli-generator";
import "isomorphic-fetch";
import { open } from "openurl";

async function fetchJson<T = any>(url: string) {
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text) as T;
}

async function getPriceFromApi(ticker: string): Promise<Record<string, any>> {
  const data = await fetchJson(
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`
  );
  return data?.chart?.result?.[0]?.meta ?? {};
}

function getNewsFromApi(quote: string) {
  return fetchJson<{ items: any[] }>(
    `https://api.rss2json.com/v1/api.json?rss_url=http://feeds.finance.yahoo.com/rss/2.0/headline?s=${quote}&region=US&lang=en-US`
  );
}

async function checkStockPrice(ticker: string) {
  const meta = await getPriceFromApi(ticker);

  if (!meta.regularMarketPrice) {
    throw Error(`Could not find stock with ticker "${ticker}"`);
  }

  console.log(meta.regularMarketPrice);
}

/**
 * Get data about a stock from its ticker (e.g. AAPL, GOOGL)
 */
async function checkStock(ticker: string) {
  const meta = await getPriceFromApi(ticker);
  const FALLBACK = "error";

  if (!meta.regularMarketPrice) {
    throw Error(`Could not find stock with ticker "${ticker}"`);
  }

  printTable([
    ["Currency", meta.currency ?? FALLBACK],
    ["Symbol", meta.symbol ?? FALLBACK],
    ["Exchange", meta.exchangeName ?? FALLBACK],
    ["Type", meta.instrumentType ?? FALLBACK],
    ["Timezone", meta.timezone ?? FALLBACK],
    ["Exchange timezone", meta.exchangeTimezoneName ?? FALLBACK],
    ["Regular market price", meta.regularMarketPrice ?? FALLBACK],
    ["Previous close", meta.chartPreviousClose ?? FALLBACK],
  ]);
}

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

/**
 * Get related to a stock
 */
async function readNews(ticker: string) {
  const { items } = await getNewsFromApi(ticker);
  printTable(items.map((item, i) => [`[${i}]`, `${item.title}`]));

  if (!items) {
    throw Error(`Could not find stock with ticker "${ticker}"`);
  }

  console.log(`Select an index (0-${items.length - 1}) to read`);
  const index = await call(getIndex)(items.length - 1);

  const { title, content, link } = items[index];

  console.log(title+'\n\n'+content);

  const confirmation = await call(getShouldOpenInBrowser)();
  if (confirmation) {
    open(link);
  }
}

async function techStocks(tickers: "AAPL" | "GOOGL") {
  await call(checkStock)(tickers);
}

export const cli: CLI = {
  checkStockPrice,
  checkStock,
  readNews,
  techStocks,
};
