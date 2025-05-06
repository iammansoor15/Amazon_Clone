"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.cli = void 0;
var ts_cli_generator_1 = require("@christianjuth/ts-cli-generator");
require("isomorphic-fetch");
var openurl_1 = require("openurl");
function fetchJson(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _a.sent();
                    return [2 /*return*/, JSON.parse(text)];
            }
        });
    });
}
function getPriceFromApi(ticker) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, Promise, function () {
        var data;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, fetchJson("https://query1.finance.yahoo.com/v8/finance/chart/".concat(ticker))];
                case 1:
                    data = _e.sent();
                    return [2 /*return*/, (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.chart) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.meta) !== null && _d !== void 0 ? _d : {}];
            }
        });
    });
}
function getNewsFromApi(quote) {
    return fetchJson("https://api.rss2json.com/v1/api.json?rss_url=http://feeds.finance.yahoo.com/rss/2.0/headline?s=".concat(quote, "&region=US&lang=en-US"));
}
function checkStockPrice(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var meta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPriceFromApi(ticker)];
                case 1:
                    meta = _a.sent();
                    if (!meta.regularMarketPrice) {
                        throw Error("Could not find stock with ticker \"".concat(ticker, "\""));
                    }
                    console.log(meta.regularMarketPrice);
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Get data about a stock from its ticker (e.g. AAPL, GOOGL)
 */
function checkStock(ticker) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function () {
        var meta, FALLBACK;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, getPriceFromApi(ticker)];
                case 1:
                    meta = _j.sent();
                    FALLBACK = "error";
                    if (!meta.regularMarketPrice) {
                        throw Error("Could not find stock with ticker \"".concat(ticker, "\""));
                    }
                    (0, ts_cli_generator_1.printTable)([
                        ["Currency", (_a = meta.currency) !== null && _a !== void 0 ? _a : FALLBACK],
                        ["Symbol", (_b = meta.symbol) !== null && _b !== void 0 ? _b : FALLBACK],
                        ["Exchange", (_c = meta.exchangeName) !== null && _c !== void 0 ? _c : FALLBACK],
                        ["Type", (_d = meta.instrumentType) !== null && _d !== void 0 ? _d : FALLBACK],
                        ["Timezone", (_e = meta.timezone) !== null && _e !== void 0 ? _e : FALLBACK],
                        ["Exchange timezone", (_f = meta.exchangeTimezoneName) !== null && _f !== void 0 ? _f : FALLBACK],
                        ["Regular market price", (_g = meta.regularMarketPrice) !== null && _g !== void 0 ? _g : FALLBACK],
                        ["Previous close", (_h = meta.chartPreviousClose) !== null && _h !== void 0 ? _h : FALLBACK],
                    ]);
                    return [2 /*return*/];
            }
        });
    });
}
function getIndex(max, index) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(index > max)) return [3 /*break*/, 2];
                    console.error("Index out of range");
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(getIndex)(max)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, index];
            }
        });
    });
}
function getShouldOpenInBrowser(openInBrowser) {
    return openInBrowser;
}
/**
 * Get related to a stock
 */
function readNews(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var items, index, _a, title, content, link, confirmation;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getNewsFromApi(ticker)];
                case 1:
                    items = (_b.sent()).items;
                    (0, ts_cli_generator_1.printTable)(items.map(function (item, i) { return ["[".concat(i, "]"), "".concat(item.title)]; }));
                    if (!items) {
                        throw Error("Could not find stock with ticker \"".concat(ticker, "\""));
                    }
                    console.log("Select an index (0-".concat(items.length - 1, ") to read"));
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(getIndex)(items.length - 1)];
                case 2:
                    index = _b.sent();
                    _a = items[index], title = _a.title, content = _a.content, link = _a.link;
                    console.log(title + '\n\n' + content);
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(getShouldOpenInBrowser)()];
                case 3:
                    confirmation = _b.sent();
                    if (confirmation) {
                        (0, openurl_1.open)(link);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function techStocks(tickers) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ts_cli_generator_1.call)(checkStock)(tickers)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.cli = {
    checkStockPrice: checkStockPrice,
    checkStock: checkStock,
    readNews: readNews,
    techStocks: techStocks
};
