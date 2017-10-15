"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const sleep_es6_1 = require("sleep-es6");
Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
exports.DEFAULT_VERSION = "2.10";
const API_URL = (version = exports.DEFAULT_VERSION) => {
    return `https://graph.facebook.com/v${version}`;
};
class Client {
    constructor(opts = {}) {
        this.apiUrl = API_URL();
        this.fetch = node_fetch_1.default;
        this.readTimeout = opts.readTimeout || 500;
        Object.defineProperty(this, "group", {
            enumerable: true,
            configurable: true,
            value: (id) => {
                return {
                    get: this.get.bind(this, id),
                    feed: () => {
                        return {
                            get: (params) => {
                                return this.getEdges(id + "/feed", params);
                            },
                            read: (params, maxId) => {
                                return this.readEdges(id + "/feed", params, maxId);
                            },
                        };
                    },
                };
            },
        });
        Object.defineProperty(this, "object", {
            enumerable: true,
            configurable: true,
            value: (id) => {
                return {
                    comments: (params) => {
                        return this.getEdges(id + "/comments", params);
                    },
                };
            },
        });
        if (typeof (opts.accessToken) !== "undefined") {
            this.accessToken = opts.accessToken;
        }
    }
    setAccessToken(token) {
        this.accessToken = token;
    }
    setFetch(newFetch) {
        this.fetch = newFetch;
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetch(API_URL() + "/" + path + "?access_token=" + this.accessToken +
                this.getUrlParamsQuery(params));
            return result.json();
        });
    }
    next(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetch(url);
            return this.prepareEdges(yield result.json());
        });
    }
    previous(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetch(url);
            return this.prepareEdges(yield result.json());
        });
    }
    getEdges(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetch(API_URL() + "/" + path + "?access_token=" + this.accessToken +
                this.getUrlParamsQuery(params));
            const edges = yield result.json();
            if (edges.error) {
                throw new Error(JSON.stringify(edges.error));
            }
            return this.prepareEdges(edges);
        });
    }
    readEdges(path, params, maxId) {
        return __asyncGenerator(this, arguments, function* readEdges_1() {
            let isEnd = false;
            let edges = yield __await(this.getEdges(path, params));
            do {
                for (const item of edges) {
                    if (maxId && item.id === maxId) {
                        isEnd = true;
                        break;
                    }
                    yield item;
                }
                yield __await(sleep_es6_1.default(this.readTimeout));
                edges = yield __await(edges.next());
                isEnd = !edges || edges.length === 0;
            } while (!isEnd);
        });
    }
    getUrlParamsQuery(params) {
        const urlParams = [];
        if (params) {
            Object.keys(params).map((paramName) => {
                const value = paramName === "fields" ? params[paramName].join(",") :
                    encodeURIComponent(params[paramName]);
                urlParams.push(paramName + "=" + value);
            });
        }
        return (urlParams.length > 0 ? "&" + urlParams.join("&") : "");
    }
    prepareEdges(edges) {
        const res = edges.data ? edges.data.map((v) => v) : [];
        res.next = edges.paging && edges.paging.next ? this.next.bind(this, edges.paging.next) : () => null;
        res.previous = edges.paging &&
            edges.paging.previous ? this.previous.bind(this, edges.paging.previous) : () => null;
        return res;
    }
}
exports.default = Client;
