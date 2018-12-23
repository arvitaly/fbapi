// tslint:disable max-line-length
import {
    IOAuthUrlParams,
    getOAuthUrl,
    OAuthResponseType,
    OAuthScope,
    getUrlForFetchAcessTokenByCode,
    fetchAccessTokenByCode,
} from "./oauth";

describe("oauth tests", () => {
    const fixtures: Array<{
        params: IOAuthUrlParams;
        expected: string;
    }> = [
        {
            params: {
                appId: 123,
                responseType: OAuthResponseType.code,
                state: "Hello",
                redirectUri: "https://callback/_maybe%&/",
            },
            expected:
                "https://www.facebook.com/v3.2/dialog/oauth?client_id=123&redirect_uri=https%3A%2F%2Fcallback%2F_maybe%25%26%2F&state=Hello&response_type=code",
        },
        {
            params: {
                appId: 123,
                responseType: OAuthResponseType.codeToken,
                display: "popup",
                redirectUri: "https://callback",
                scopes: [OAuthScope.ads_management, OAuthScope.publish_pages],
                state: "World",
            },
            expected:
                "https://www.facebook.com/v3.2/dialog/oauth?client_id=123&redirect_uri=https%3A%2F%2Fcallback&state=World&scope=ads_management,publish_pages&display=popup&response_type=code%20token",
        },
    ];
    it("getOAuthUrl", () => {
        for (const fixture of fixtures) {
            expect(getOAuthUrl(fixture.params)).toBe(fixture.expected);
        }
    });
    it("getUrlForFetchAcessTokenByCode", () => {
        expect(
            getUrlForFetchAcessTokenByCode({
                appId: 111,
                appSecret: "Secret1",
                code: "CCOODDEE",
                redirectUri: "https://redirect.me/_&%/hello",
            }),
        ).toBe(
            `https://graph.facebook.com/v3.2/oauth/access_token?client_id=111&redirect_uri=https%3A%2F%2Fredirect.me%2F_%26%25%2Fhello&client_secret=Secret1&code=CCOODDEE`,
        );
    });
    it("fetchAccessTokenByCode success", async () => {
        const fetch = jest.fn().mockImplementation((url: string) => {
            return Promise.resolve({
                status: 200,
                json: () =>
                    Promise.resolve({
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
        expect(await fetchAccessTokenByCode(params)).toEqual({
            url: getUrlForFetchAcessTokenByCode(params),
        });
    });
});
