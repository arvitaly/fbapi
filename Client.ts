import fetch from "node-fetch";
const API_URL = (version: string = "2.8") => {
    return `https://graph.facebook.com/v${version}`;
};
export interface IOpts {
    accessToken?: string;
}
class Client {
    protected apiUrl = API_URL();
    protected fetch = fetch;
    protected accessToken: string;
    constructor(opts: IOpts = {}) {
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
                        };
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
        const result = await this.fetch(API_URL() + "/" + path + "?access_token=" + this.accessToken +
            this.getUrlParamsQuery(params));
        return result.json();
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
        return this.prepareEdges(edges);
    }
    protected getUrlParamsQuery(params: { [index: string]: any }) {
        let urlParams: string[] = [];
        if (params) {
            Object.keys(params).map((paramName) => {
                let value: string;
                if (paramName === "fields") {
                    value = params[paramName].join(",");
                } else {
                    value = encodeURIComponent(params[paramName]);
                }
                urlParams.push(paramName + "=" + value);
            });
        }
        return (urlParams.length > 0 ? "&" + urlParams.join("&") : "");
    }
    protected prepareEdges(edges: any) {
        const res = edges.data ? edges.data.map((v: any) => v) : [];
        res.next = edges.paging.next ? this.next.bind(this, edges.paging.next) : () => null;
        res.previous = edges.paging.previous ? this.previous.bind(this, edges.paging.previous) : () => null;
        return res;
    }
}

export default Client;
