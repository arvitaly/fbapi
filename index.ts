export * from "./typings";
import FacebookClient, { IClientOpts } from "./Client";
export * from "./oauth";
import { IClient } from "./typings";
export { default as FacebookAPI } from "./Client";
export default (opts?: IClientOpts): IClient => {
    return new FacebookClient(opts) as any;
};
export const Client: new (opts?: IClientOpts) => IClient = FacebookClient as any;
