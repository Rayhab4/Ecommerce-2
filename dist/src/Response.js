"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.ok = void 0;
const ok = (res, data, msg, code = 200) => res.status(code).json({ success: true, data, message: msg });
exports.ok = ok;
const fail = (res, msg, code = 400) => res.status(code).json({ success: false, data: null, message: msg });
exports.fail = fail;
