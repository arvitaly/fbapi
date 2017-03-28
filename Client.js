"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const API_URL = (version = "2.8") => {
    return `https://graph.facebook.com/v${version}`;
};
class Client {
    constructor(opts = {}) {
        this.apiUrl = API_URL();
        this.fetch = node_fetch_1.default;
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
                        };
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
    getUrlParamsQuery(params) {
        let urlParams = [];
        if (params) {
            Object.keys(params).map((paramName) => {
                let value;
                if (paramName === "fields") {
                    value = params[paramName].join(",");
                }
                else {
                    value = encodeURIComponent(params[paramName]);
                }
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
