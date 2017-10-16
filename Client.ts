import fetch from "node-fetch";
import sleep from "sleep-es6";
(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
export const DEFAULT_VERSION = "2.10";
const API_URL = (version: string = DEFAULT_VERSION) => {
    return `https://graph.facebook.com/v${version}`;
};
export interface IOpts {
    accessToken?: string;
    readTimeout?: number;
}
class Client {
    protected apiUrl = API_URL();
    protected fetch = fetch;
    protected accessToken: string;
    protected readTimeout: number;
    constructor(opts: IOpts = {}) {
        this.readTimeout = opts.readTimeout || 500;
        Object.defineProperty(this, "search", {
            enumerable: true,
            configurable: true,
            value: () => {
                return {
                    get: (params: any) => {
                        return this.getEdges("search", params);
                    },
                    read: (params: any) => {
                        return this.readEdges("search", params);
                    },
                };
            },
        });
        Object.defineProperty(this, "group", {
            enumerable: true,
            configurable: true,
            value: (id: string) => {
                return {
                    get: this.get.bind(this, id),
                    feed: () => {
                        return {
                            get: (params: any) => {
                                return this.getEdges(id + "/feed", params);
                            },
                            read: (params: any, maxId: string) => {
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
            value: (id: string) => {
                return {
                    comments: (params: any) => {
                        return this.getEdges(id + "/comments", params);
                    },
                };
            },
        });
        if (typeof (opts.accessToken) !== "undefined") {
            this.accessToken = opts.accessToken;
        }
    }
    public setAccessToken(token: string) {
        this.accessToken = token;
    }
    public setFetch(newFetch: typeof fetch) {
        this.fetch = newFetch;
    }
    public async get(path: string, params: { [index: string]: any }) {
        const response = await this.fetch(API_URL() + "/" + path + "?access_token=" + this.accessToken +
            this.getUrlParamsQuery(params));
        const result = await response.json();
        if (result.error) {
            throw new Error("Facebook error: " + JSON.stringify(result.error)
                + ", version " + this.apiUrl
                + ", path " +
                path + ", params: " + JSON.stringify(params),
            );
        }
        return result;
    }
    public async next(url: string) {
        const result = await this.fetch(url);
        return this.prepareEdges(await result.json());
    }
    public async previous(url: string) {
        const result = await this.fetch(url);
        return this.prepareEdges(await result.json());
    }
    public async getEdges(path: string, params: { [index: string]: any }) {
        const result = await this.fetch(API_URL() + "/" + path + "?access_token=" + this.accessToken +
            this.getUrlParamsQuery(params));
        const edges = await result.json();
        if (edges.error) {
            throw new Error(JSON.stringify(edges.error));
        }
        return this.prepareEdges(edges);
    }
    public async *readEdges(path: string, params: { [index: string]: any }, maxId?: string) {
        let isEnd = false;
        let edges = await this.getEdges(path, params);
        do {
            for (const item of edges) {
                if (maxId && item.id === maxId) {
                    isEnd = true;
                    break;
                }
                yield item;
            }
            await sleep(this.readTimeout);
            edges = await edges.next();
            isEnd = !edges || edges.length === 0;
        } while (!isEnd);
    }
    protected getUrlParamsQuery(params: { [index: string]: any }) {
        const urlParams: string[] = [];
        if (params) {
            Object.keys(params).map((paramName) => {
                const value = paramName === "fields" ? params[paramName].join(",") :
                    encodeURIComponent(params[paramName]);
                urlParams.push(paramName + "=" + value);
            });
        }
        return (urlParams.length > 0 ? "&" + urlParams.join("&") : "");
    }
    protected prepareEdges(edges: any) {
        const res = edges.data ? edges.data.map((v: any) => v) : [];
        res.next = edges.paging && edges.paging.next ? this.next.bind(this, edges.paging.next) : () => null;
        res.previous = edges.paging &&
            edges.paging.previous ? this.previous.bind(this, edges.paging.previous) : () => null;
        Object.defineProperty(res, "paging", {
            configurable: false,
            enumerable: false,
            value: edges.paging,
        });
        return res;
    }
}

export default Client;
