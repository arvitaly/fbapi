export * from "./typings";
import FacebookClient, { IOpts } from "./Client";
export * from "./oauth";
import { IClient } from "./typings";
export { default as FacebookAPI } from "./Client";
export default (opts?: IOpts): IClient => {
    return new FacebookClient(opts) as any;
};
export const Client: IClient = FacebookClient as any;
