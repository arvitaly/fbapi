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
// tslint:disable max-line-length
const oauth_1 = require("./oauth");
describe("oauth tests", () => {
    const fixtures = [
        {
            params: {
                appId: 123,
                responseType: oauth_1.OAuthResponseType.code,
                state: "Hello",
                redirectUri: "https://callback/_maybe%&/",
            },
            expected: "https://www.facebook.com/v3.2/dialog/oauth?client_id=123&redirect_uri=https%3A%2F%2Fcallback%2F_maybe%25%26%2F&state=Hello&response_type=code",
        },
        {
            params: {
                appId: 123,
                responseType: oauth_1.OAuthResponseType.codeToken,
                display: "popup",
                redirectUri: "https://callback",
                scopes: [oauth_1.OAuthScope.ads_management, oauth_1.OAuthScope.publish_pages],
                state: "World",
            },
            expected: "https://www.facebook.com/v3.2/dialog/oauth?client_id=123&redirect_uri=https%3A%2F%2Fcallback&state=World&scope=ads_management,publish_pages&display=popup&response_type=code%20token",
        },
    ];
    it("getOAuthUrl", () => {
        for (const fixture of fixtures) {
            expect(oauth_1.getOAuthUrl(fixture.params)).toBe(fixture.expected);
        }
    });
    it("getUrlForFetchAcessTokenByCode", () => {
        expect(oauth_1.getUrlForFetchAcessTokenByCode({
            appId: 111,
            appSecret: "Secret1",
            code: "CCOODDEE",
            redirectUri: "https://redirect.me/_&%/hello",
        })).toBe(`https://graph.facebook.com/v3.2/oauth/access_token?client_id=111&redirect_uri=https%3A%2F%2Fredirect.me%2F_%26%25%2Fhello&client_secret=Secret1&code=CCOODDEE`);
    });
    it("fetchAccessTokenByCode success", () => __awaiter(this, void 0, void 0, function* () {
        const fetch = jest.fn().mockImplementation((url) => {
            return Promise.resolve({
                status: 200,
                json: () => Promise.resolve({
                    url,
                }),
            });
        });
        const params = {
            appId: 12,
            appSecret: "Secret2",
            code: "Code1",
            redirectUri: "red",
            fetch,
        };
        expect(yield oauth_1.fetchAccessTokenByCode(params)).toEqual({
            url: oauth_1.getUrlForFetchAcessTokenByCode(params),
        });
    }));
});
