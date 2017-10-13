export * from "./typings";
import Client, { IOpts } from "./Client";
import { IClient } from "./typings";
export { default as Client } from "./Client";
export default (opts?: IOpts): IClient => {
    return new Client(opts) as any;
};
