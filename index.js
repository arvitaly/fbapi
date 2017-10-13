"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Client");
var Client_2 = require("./Client");
exports.Client = Client_2.default;
exports.default = (opts) => {
    return new Client_1.default(opts);
};
