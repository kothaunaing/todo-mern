"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateUniqueId;
const uuid_1 = require("uuid");
function generateUniqueId() {
    const id = (0, uuid_1.v4)();
    return id;
}
