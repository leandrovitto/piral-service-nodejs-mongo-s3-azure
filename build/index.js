"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
// eslint-disable-next-line no-console
var express_1 = __importDefault(require("express"));
var setting_1 = require("./setting");
var endpoints_1 = __importDefault(require("./endpoints"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1.default)();
var port = setting_1.NODE_PORT || 3000;
// const router = express.Router();
app.use(body_parser_1.default.json()); //application/json
//app.use('/', router);
//Routing
(0, endpoints_1.default)(app);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port, function () {
    return console.log("Express is listening at http://localhost:".concat(port));
});
