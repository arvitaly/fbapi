import Client from "./../client";
import { IClient } from "./../typings";
describe("Client test", () => {
    let client: IClient;
    const fetch = jest.fn((url: string) => {
        if (url === "https://graph.facebook.com/v2.8/123?access_token=at1") {
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
        client = new Client({ accessToken: "at1" }) as any;
        client.setFetch(fetch);
    });
    it("get single", async () => {
        const group = await client.group("123").get({
            fields: ["id", "name"],
        });
        expect(group).toMatchSnapshot();
    });
    it("get edges", async () => {
        const edges = await client.group("123").feed().get({ fields: ["message"] });
        expect(edges).toMatchSnapshot();
        const nextEdges = await edges.next();
        expect(nextEdges).toMatchSnapshot();
        expect(await nextEdges.previous()).toMatchSnapshot();
    });
});
