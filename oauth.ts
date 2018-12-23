import fetch from "node-fetch";
export enum OAuthScope {
    instagram_basic = "instagram_basic",
    instagram_manage_comments = "instagram_manage_comments",
    instagram_manage_insights = "instagram_manage_insights",

    publish_video = "publish_video",

    pages_messaging = "pages_messaging",
    pages_messaging_subscriptions = "pages_messaging_subscriptions",

    ads_management = "ads_management",
    ads_read = "ads_read",
    business_management = "business_management",
    leads_retrieval = "leads_retrieval",
    read_audience_network_insights = "read_audience_network_insights",
    read_insights = "read_insights",
    manage_pages = "manage_pages",
    pages_show_list = "pages_show_list",
    pages_manage_cta = "pages_manage_cta",
    pages_manage_instant_articles = "pages_manage_instant_articles",
    publish_pages = "publish_pages",
    read_page_mailboxes = "read_page_mailboxes",

    email = "email",
    groups_access_member_info = "groups_access_member_info",
    publish_to_groups = "publish_to_groups",
    user_age_range = "user_age_range",
    user_birthday = "user_birthday",
    user_events = "user_events",
    user_friends = "user_friends",
    user_gender = "user_gender",
    user_hometown = "user_hometown",
    user_likes = "user_likes",
    user_link = "user_link",
    user_location = "user_location",
    user_photos = "user_photos",
    user_posts = "user_posts",
    user_tagged_places = "user_tagged_places",
    user_videos = "user_videos",
}
export enum OAuthResponseType {
    code = "code",
    token = "token",
    codeToken = "code token",
    granted_scopes = "granted_scopes",
}
export interface IOAuthUrlParams {
    appId: string | number;
    redirectUri: string;
    scopes?: OAuthScope[];
    display?: "popup";
    state: any;
    responseType: string;
}
export function getOAuthUrl({ appId, redirectUri, display, responseType, state, scopes }: IOAuthUrlParams) {
    return (
        `https://www.facebook.com/v3.2/dialog/oauth?client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}` +
        (scopes && scopes.length > 0 ? `&scope=` + scopes.join(",") : "") +
        (display ? `&display=` + display : ``) +
        (responseType ? `&response_type=` + encodeURIComponent(responseType) : ``)
    );
}
export interface IFetchAccessTokenByCodeParams {
    appId: string | number;
    redirectUri: string;
    appSecret: string;
    code: string;
}
export interface IFetchAccessTokenByCodeResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}
export class FacebookOAuthError extends Error {
    constructor(public data: { message: string; type: string; code: number }) {
        super(data.message);
    }
}
export async function fetchAccessTokenByCode(
    params: IFetchAccessTokenByCodeParams & {
        fetch?: typeof fetch;
    },
): Promise<IFetchAccessTokenByCodeResponse> {
    const thisFetch = params.fetch ? params.fetch : fetch;
    const url = getUrlForFetchAcessTokenByCode(params);
    const response = await thisFetch(url);
    const data = await response.json();
    if (response.status !== 200) {
        throw new FacebookOAuthError(data.error);
    }
    return data;
}
export function getUrlForFetchAcessTokenByCode({ appId, appSecret, redirectUri, code }: IFetchAccessTokenByCodeParams) {
    return (
        `https://graph.facebook.com/v3.2/oauth/access_token?` +
        `client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&client_secret=${appSecret}` +
        `&code=${code}`
    );
}
