"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contactcontroller_1 = require("../controllers/Contactcontroller");
const router = express_1.default.Router();
router.post("/", Contactcontroller_1.createContact);
exports.default = router;
