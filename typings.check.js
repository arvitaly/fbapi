"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
client.group("123").get({
    fields: ["cover"],
});
function getGroup() {
    return __awaiter(this, void 0, void 0, function* () {
        const group = yield client.group("111").get();
        group.name.charAt(0);
    });
}
function getFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        let isFinish = false;
        do {
            let feed = yield client
                .group("123")
                .feed()
                .get({
                fields: ["id"],
            });
            feed.map((post) => {
                post.id.charAt(0);
            });
            feed = yield feed.next();
            isFinish = !!feed;
        } while (!isFinish);
        try {
            for (var _b = __asyncValues(client.search().read({
                type: "place",
                fields: ["id"],
            })), _c; _c = yield _b.next(), !_c.done;) {
                const place = _c.value;
                place.about.toLocaleLowerCase();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function getMe() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield client.me().get();
        user.first_name.toLowerCase();
        const user2 = yield client.me().get({ fields: ["name"] });
        user2.name.toUpperCase();
    });
}
getGroup();
getFeed();
getMe();
