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
    });
}
