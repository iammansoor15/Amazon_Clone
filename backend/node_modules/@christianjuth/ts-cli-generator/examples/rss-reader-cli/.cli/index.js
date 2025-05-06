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
function fetchRssAsJson(url) {
    return fetchJson("https://api.rss2json.com/v1/api.json?rss_url=".concat(url));
}
var formatText = function (html) {
    return html
        .replace(/\n/gi, "")
        .replace(/<\/\s*(?:p|div)>/gi, " ")
        .replace(/<br[^>]*\/?>/gi, " ")
        .replace(/<[^>]*>/gi, "")
        .replace("&nbsp;", " ")
        .replace(/[^\S\r\n][^\S\r\n]+/gi, " ")
        .replace(/(\n|\r|\n\r)+/g, "");
};
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
function selectArticle(items) {
    return __awaiter(this, void 0, void 0, function () {
        var index, _a, title, pubDate, author, description, link, confirmation;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Select an article");
                    (0, ts_cli_generator_1.printTable)(items.map(function (item, i) { return ["[".concat(i, "]"), "".concat(item.title)]; }));
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(getIndex)(items.length)];
                case 1:
                    index = _b.sent();
                    _a = items[index], title = _a.title, pubDate = _a.pubDate, author = _a.author, description = _a.description, link = _a.link;
                    (0, ts_cli_generator_1.printTable)([title, pubDate, author, " ", description]
                        .filter(Boolean)
                        .map(function (text) { return [formatText(text)]; }));
                    if (!link) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(getShouldOpenInBrowser)()];
                case 2:
                    confirmation = _b.sent();
                    if (confirmation) {
                        (0, openurl_1.open)(link);
                    }
                    _b.label = 3;
                case 3: return [4 /*yield*/, (0, ts_cli_generator_1.call)(selectArticle)(items)];
                case 4:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function selectNewsSource(source) {
    return __awaiter(this, void 0, void 0, function () {
        var url, items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "";
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
                    return [4 /*yield*/, fetchRssAsJson(url)];
                case 1:
                    items = (_a.sent()).items;
                    if ((items === null || items === void 0 ? void 0 : items.length) === 0) {
                        throw new Error("failed to load articles form ".concat(source));
                    }
                    return [4 /*yield*/, (0, ts_cli_generator_1.call)(selectArticle)(items)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.cli = {
    selectNewsSource: selectNewsSource
};
