"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.connection = mysql_1.default.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || 'noteapp',
});
// Connect to the database
exports.connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});
