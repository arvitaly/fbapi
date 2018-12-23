"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./../client");
const group1 = { id: 15 };
const posts = [
    {
        id: "555",
        message: "Hie",
    },
    {
        id: "666",
        message: "Where?",
    },
];
const user1 = {
    id: "1234",
    first_name: "John",
};
describe("Client test", () => {
    let client;
    const fetch = jest.fn((url) => {
        if (url === "https://graph.facebook.com/v" + client_1.DEFAULT_VERSION + "/123?access_token=at1&fields=id,name") {
            return {
                json: () => {
                    return group1;
                },
            };
        }
        if (url === "nextPage") {
            return {
                json: () => {
                    return {
                        data: [{ id: "next1" }],
                        paging: {
                            previous: "previousPage",
                        },
                    };
                },
            };
        }
        if (url === "previousPage") {
            return {
                json: () => {
                    return {
                        data: [{ id: "prev1" }],
                    };
                },
            };
        }
        if (url === "https://graph.facebook.com/v" + client_1.DEFAULT_VERSION + "/123/feed?access_token=at1&fields=message") {
            return {
                json: () => {
                    return {
                        data: posts,
                        paging: {
                            next: "nextPage",
                        },
                    };
                },
            };
        }
        if (url === "https://graph.facebook.com/v" + client_1.DEFAULT_VERSION + "/124/feed?access_token=at1&fields=message") {
            return {
                json: () => {
                    return {
                        data: posts,
                        paging: {
                            next: "https://graph.facebook.com/v" +
                                client_1.DEFAULT_VERSION +
                                "/124/feed?access_token=at1&fields=message&n1",
                        },
                    };
                },
            };
        }
        if (url === "https://graph.facebook.com/v" + client_1.DEFAULT_VERSION + "/124/feed?access_token=at1&fields=message&n1") {
            return {
                json: () => {
                    return {
                        data: [{ message: "end" }],
                        paging: {
                            next: null,
                        },
                    };
                },
            };
        }
        if (url === "https://graph.facebook.com/v" + client_1.DEFAULT_VERSION + "/me?access_token=at1") {
            return {
                json: () => {
                    return user1;
                },
            };
        }
        return Promise.reject("Unknown request: " + url);
    });
    beforeEach(() => {
        client = new client_1.default({ accessToken: "at1" });
        client.setFetch(fetch);
    });
    it("get me", () => __awaiter(this, void 0, void 0, function* () {
        const me = yield client.me().get();
        expect(me).toEqual(user1);
    }));
    it("get single", () => __awaiter(this, void 0, void 0, function* () {
        const group = yield client.group("123").get({
            fields: ["id", "name"],
        });
        expect(group).toEqual(group1);
    }));
    it("get edges", () => __awaiter(this, void 0, void 0, function* () {
        const edges = yield client
            .group("123")
            .feed()
            .get({ fields: ["message"] });
        const ps = posts.map((i) => i);
        ps.next = jasmine.any(Function);
        ps.previous = jasmine.any(Function);
        expect(edges).toEqual(ps);
        const nextEdges = yield edges.next();
        const p = [{ id: "next1" }];
        p.previous = jasmine.any(Function);
        p.next = jasmine.any(Function);
        expect(nextEdges).toEqual(p);
        p[0].id = "prev1";
        expect(yield nextEdges.previous()).toEqual(p);
    }));
    it("read edges", () => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        const edges = client
            .group("124")
            .feed()
            .read({ fields: ["message"] });
        let i = 0;
        try {
            for (var edges_1 = __asyncValues(edges), edges_1_1; edges_1_1 = yield edges_1.next(), !edges_1_1.done;) {
                const edge = edges_1_1.value;
                switch (i) {
                    case 0:
                        expect(edge.message).toBe("Hie");
                        break;
                    case 1:
                        expect(edge.message).toBe("Where?");
                        break;
                    case 2:
                        expect(edge.message).toBe("end");
                        break;
                    default:
                        throw new Error("Unknown number");
                }
                i++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) yield _a.call(edges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        expect(i).toBe(3);
    }));
});
