"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
var express_1 = __importDefault(require("express"));
var pilets_controller_1 = require("../controllers/pilets.controller");
var router = express_1.default.Router();
router.get("/", pilets_controller_1.getPilets);
var piletRoutes = router;
exports.default = piletRoutes;
