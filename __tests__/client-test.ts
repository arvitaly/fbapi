import Client from "./../client";
import { IClient } from "./../typings";
const group1 = { id: 15 };
const posts = [{
    id: "555",
    message: "Hie",
}, {
    id: "666",
    message: "Where?",
}];
describe("Client test", () => {
    let client: IClient;
    const fetch = jest.fn((url: string) => {
        if (url === "https://graph.facebook.com/v2.8/123?access_token=at1&fields=id,name") {
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
        if (url === "https://graph.facebook.com/v2.8/123/feed?access_token=at1&fields=message") {
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
        if (url === "https://graph.facebook.com/v2.8/124/feed?access_token=at1&fields=message") {
            return {
                json: () => {
                    return {
                        data: posts,
                        paging: {
                            next: "https://graph.facebook.com/v2.8/124/feed?access_token=at1&fields=message&n1",
                        },
                    };
                },
            };
        }
        if (url === "https://graph.facebook.com/v2.8/124/feed?access_token=at1&fields=message&n1") {
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
        expect(group).toEqual(group1);
    });
    it("get edges", async () => {
        const edges = await client.group("123").feed().get({ fields: ["message"] });
        const ps: any = posts.map((i) => i);
        ps.next = jasmine.any(Function);
        ps.previous = jasmine.any(Function);
        expect(edges).toEqual(ps);
        const nextEdges = await edges.next();
        const p: any = [{ id: "next1" }];
        p.previous = jasmine.any(Function);
        p.next = jasmine.any(Function);
        expect(nextEdges).toEqual(p);
        p[0].id = "prev1";
        expect(await nextEdges.previous()).toEqual(p);
    });
    it("read edges", async () => {
        const edges = client.group("124").feed().read({ fields: ["message"] });
        let i = 0;
        for await (const edge of edges) {
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
        expect(i).toBe(3);
    });
});
