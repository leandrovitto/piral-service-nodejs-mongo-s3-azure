"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pilets_routes_1 = __importDefault(require("./pilets.routes"));
var routes_1 = require("./routes");
var routes = function (app) {
    return app.use("".concat(routes_1.API).concat(routes_1.V1).concat(routes_1.PILET), pilets_routes_1.default);
};
exports.default = routes;
