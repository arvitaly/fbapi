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
const node_fetch_1 = require("node-fetch");
var OAuthScope;
(function (OAuthScope) {
    OAuthScope["instagram_basic"] = "instagram_basic";
    OAuthScope["instagram_manage_comments"] = "instagram_manage_comments";
    OAuthScope["instagram_manage_insights"] = "instagram_manage_insights";
    OAuthScope["publish_video"] = "publish_video";
    OAuthScope["pages_messaging"] = "pages_messaging";
    OAuthScope["pages_messaging_subscriptions"] = "pages_messaging_subscriptions";
    OAuthScope["ads_management"] = "ads_management";
    OAuthScope["ads_read"] = "ads_read";
    OAuthScope["business_management"] = "business_management";
    OAuthScope["leads_retrieval"] = "leads_retrieval";
    OAuthScope["read_audience_network_insights"] = "read_audience_network_insights";
    OAuthScope["read_insights"] = "read_insights";
    OAuthScope["manage_pages"] = "manage_pages";
    OAuthScope["pages_show_list"] = "pages_show_list";
    OAuthScope["pages_manage_cta"] = "pages_manage_cta";
    OAuthScope["pages_manage_instant_articles"] = "pages_manage_instant_articles";
    OAuthScope["publish_pages"] = "publish_pages";
    OAuthScope["read_page_mailboxes"] = "read_page_mailboxes";
    OAuthScope["email"] = "email";
    OAuthScope["groups_access_member_info"] = "groups_access_member_info";
    OAuthScope["publish_to_groups"] = "publish_to_groups";
    OAuthScope["user_age_range"] = "user_age_range";
    OAuthScope["user_birthday"] = "user_birthday";
    OAuthScope["user_events"] = "user_events";
    OAuthScope["user_friends"] = "user_friends";
    OAuthScope["user_gender"] = "user_gender";
    OAuthScope["user_hometown"] = "user_hometown";
    OAuthScope["user_likes"] = "user_likes";
    OAuthScope["user_link"] = "user_link";
    OAuthScope["user_location"] = "user_location";
    OAuthScope["user_photos"] = "user_photos";
    OAuthScope["user_posts"] = "user_posts";
    OAuthScope["user_tagged_places"] = "user_tagged_places";
    OAuthScope["user_videos"] = "user_videos";
})(OAuthScope = exports.OAuthScope || (exports.OAuthScope = {}));
var OAuthResponseType;
(function (OAuthResponseType) {
    OAuthResponseType["code"] = "code";
    OAuthResponseType["token"] = "token";
    OAuthResponseType["codeToken"] = "code token";
    OAuthResponseType["granted_scopes"] = "granted_scopes";
})(OAuthResponseType = exports.OAuthResponseType || (exports.OAuthResponseType = {}));
function getOAuthUrl({ appId, redirectUri, display, responseType, state, scopes }) {
    return (`https://www.facebook.com/v3.2/dialog/oauth?client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&state=${state}` +
        (scopes && scopes.length > 0 ? `&scope=` + scopes.join(",") : "") +
        (display ? `&display=` + display : ``) +
        (responseType ? `&response_type=` + encodeURIComponent(responseType) : ``));
}
exports.getOAuthUrl = getOAuthUrl;
class FacebookOAuthError extends Error {
    constructor(data) {
        super(data.message);
        this.data = data;
    }
}
exports.FacebookOAuthError = FacebookOAuthError;
function fetchAccessTokenByCode(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisFetch = params.fetch ? params.fetch : node_fetch_1.default;
        const url = getUrlForFetchAcessTokenByCode(params);
        const response = yield thisFetch(url);
        const data = yield response.json();
        if (response.status !== 200) {
            throw new FacebookOAuthError(data.error);
        }
        return data;
    });
}
exports.fetchAccessTokenByCode = fetchAccessTokenByCode;
function getUrlForFetchAcessTokenByCode({ appId, appSecret, redirectUri, code }) {
    return (`https://graph.facebook.com/v3.2/oauth/access_token?` +
        `client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&client_secret=${appSecret}` +
        `&code=${code}`);
}
exports.getUrlForFetchAcessTokenByCode = getUrlForFetchAcessTokenByCode;
