"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Usercontroller_1 = require("../controllers/Usercontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const router = express_1.default.Router();
// Create a new user (this route may be public for registration)
router.post('/new', Usercontroller_1.newuser);
// Protect the following routes with authentication middleware
router.get('/:id', Authmiddlewares_1.authMiddleware, Usercontroller_1.getUser);
router.put('/:id', Authmiddlewares_1.authMiddleware, Usercontroller_1.updateUser);
router.delete('/:id', Authmiddlewares_1.authMiddleware, Usercontroller_1.deleteUser);
exports.default = router;
