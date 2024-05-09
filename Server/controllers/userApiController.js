"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import the cors middleware
const db_1 = require("../config/db");
const otp_1 = __importDefault(require("../auth/otp"));
require('dotenv').config;
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
const port = '4000';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Use the cors middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let otpCache;
db_1.connection.query('SHOW TABLES', (error, results, fields) => {
    if (error) {
        console.error('Error querying tables: ', error);
        return;
    }
    console.log('Tables in the database:', results);
});
app.post('/Signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, password, otp } = req.body;
    if (!name || !email || !phone || !password || !otp) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    db_1.connection.query('SELECT * FROM signup WHERE email = ?', email, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: false, error: 'Email already exists. Please login.' });
        }
        // Verify OTP
        if (!otpCache) {
            return res.status(400).json({ success: false, error: 'OTP cache is missing. Please try again.' });
        }
        const otpMatch = yield bcrypt_1.default.compare(otp, otpCache);
        if (!otpMatch) {
            return res.status(400).json({ success: false, error: 'Incorrect OTP. Please try again.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 7);
        const newUser = { name, email, phone, password };
        db_1.connection.query('INSERT INTO signup SET ?', newUser, (err, result) => {
            if (err) {
                console.error('Error inserting new user:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            console.log('results...,...............>', newUser);
            const userId = newUser.email;
            console.log('userId...>', userId);
            // Insert initial notes for the user
            const initialNotes = [
                { user_id: userId, title: 'First Note', content: 'This is your first note.' },
                { user_id: userId, title: 'Second Note', content: 'This is your second note.' }
            ];
            console.log("-----------------------------------------------");
            db_1.connection.query('INSERT INTO notes (user_id, title, content) VALUES ?', [initialNotes.map(note => [note.user_id, note.title, note.content])], (err) => {
                if (err) {
                    console.error('Error inserting initial notes:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
                console.log('Initial notes inserted.');
                res.status(201).json({ success: true, message: 'User signed up successfully!...Please Login' });
            });
        });
    }));
}));
app.post('/getOTP', (req, res) => {
    console.log("inside the otp...");
    const { email } = req.body;
    db_1.connection.query('SELECT * FROM signup WHERE email = ?', email, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            console.log('Email or Mobile Number Already Exists...');
            return res.status(400).json({ success: false, error: 'Email or Mobile Number Already Exists...' });
        }
        try {
            const { otp, hashedOTP } = yield (0, otp_1.default)(email);
            otpCache = hashedOTP;
            console.log("Generated OTP", otp);
            res.json({ message: 'OTP generated and sent to your email for verification.' });
        }
        catch (error) {
            console.error('Error during OTP generation and sending:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }));
});
app.post('/Login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM.,1234567890!@#$%^&*()';
    try {
        const { email, password } = req.body;
        console.log('login--reb body--->', req.body);
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required.' });
        }
        db_1.connection.query('SELECT * FROM signup WHERE email = ?', email, (err, results) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error checking email:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ success: false, error: 'User not found. Please sign up.' });
            }
            const user = results[0];
            console.log('user==>', user);
            console.log('password==>', password, user.password);
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            console.log('user passwordMatch==>', yield bcrypt_1.default.compare(password, user.password));
            if (user.password !== password) {
                console.log('login--Incorrect password.--->');
                return res.status(401).json({ success: false, error: 'Incorrect password.' });
            }
            console.log('Login In Succesfull....');
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secretKey);
            console.log('TOKEN----->', token);
            // Send token in response
            res.json({ success: true, message: 'Login In Succesfull.', token, name: user.name, email: user.email, id: user.idsignup });
        }));
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
