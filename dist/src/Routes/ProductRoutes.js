"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Productcontroller_1 = require("../controllers/Productcontroller");
const Authmiddlewares_1 = require("../middlewares/Authmiddlewares");
const router = express_1.default.Router();
router.post('/', Authmiddlewares_1.authMiddleware, Productcontroller_1.createProduct);
router.get('/', Authmiddlewares_1.authMiddleware, Productcontroller_1.getAllProducts);
router.get('/:id', Authmiddlewares_1.authMiddleware, Productcontroller_1.getProductById);
router.put('/:id', Authmiddlewares_1.authMiddleware, Productcontroller_1.updateProduct);
router.delete('/:id', Authmiddlewares_1.authMiddleware, Productcontroller_1.deleteProduct);
exports.default = router;
