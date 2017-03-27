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
const client_1 = require("./../client");
describe("Client test", () => {
    let client;
    const fetch = jest.fn((url) => {
        if (url === "https://graph.facebook.com/v2.8/123?access_token=at1&fields=id,name") {
            return {
                json: () => {
                    return { id: 15 };
                },
            };
        }
        if (url === "nextPage") {
            return {
                json: () => {
                    return {
                        data: [{ id: "next1" }],
                        previous: "previousPage",
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
        if (url === "https://graph.facebook.com/v2.8/123/feed?access_token=at1") {
            return {
                json: () => {
                    return {
                        data: [{
                                id: "555",
                                message: "Hie",
                            }, {
                                id: "666",
                                message: "Where?",
                            }],
                        next: "nextPage",
                    };
                },
            };
        }
        return Promise.reject("Unknown request: " + url);
    });
    beforeEach(() => {
        client = new client_1.default({ accessToken: "at1" });
        client.setFetch(fetch);
    });
    it("get single", () => __awaiter(this, void 0, void 0, function* () {
        const group = yield client.group("123").get({
            fields: ["id", "name"],
        });
        expect(group).toMatchSnapshot();
    }));
    it("get edges", () => __awaiter(this, void 0, void 0, function* () {
        const edges = yield client.group("123").feed().get({ fields: ["message"] });
        expect(edges).toMatchSnapshot();
        const nextEdges = yield edges.next();
        expect(nextEdges).toMatchSnapshot();
        expect(yield nextEdges.previous()).toMatchSnapshot();
    }));
});
