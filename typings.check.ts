import { IClient } from "./typings";
declare const client: IClient;
client.group("123").get({
    fields: ["cover"],
});
async function getGroup() {
    const group = await client.group("111").get();
    group.name.charAt(0);
}
async function getFeed() {
    let isFinish = false;
    do {
        let feed = await client.group("123").feed().get({
            fields: ["id"],
        });
        feed.map((post) => {
            post.id.charAt(0);
        });
        feed = await feed.next();
        isFinish = !!feed;
    } while (!isFinish);
}
getGroup();
getFeed();
