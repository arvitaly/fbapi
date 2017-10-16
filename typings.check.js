"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
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
        let isFinish = false;
        do {
            let feed = yield client.group("123").feed().get({
                fields: ["id"],
            });
            feed.map((post) => {
                post.id.charAt(0);
            });
            feed = yield feed.next();
            isFinish = !!feed;
        } while (!isFinish);
        try {
            for (var _a = __asyncValues(client.search().read({
                type: "place",
                fields: ["id"],
            })), _b; _b = yield _a.next(), !_b.done;) {
                const place = yield _b.value;
                place.about.toLocaleLowerCase();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) yield _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    });
}
getGroup();
getFeed();
