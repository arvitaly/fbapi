"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Client");
__export(require("./oauth"));
var Client_2 = require("./Client");
exports.FacebookAPI = Client_2.default;
exports.default = (opts) => {
    return new Client_1.default(opts);
};
exports.Client = Client_1.default;
