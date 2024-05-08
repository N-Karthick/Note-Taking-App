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
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'karthickdeva6800@gmail.com',
        pass: 'mjqj kbsx iuku dori',
    },
});
function generateOTP(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const otp = otp_generator_1.default.generate(6, { digits: true });
        const hashedOTP = yield bcrypt_1.default.hash(otp, 10);
        const mailOptions = {
            from: { name: 'NODE OTP', address: 'karthickdeva6800@gmail.com' },
            to: email, // Dynamically set recipient email
            subject: 'OTP Verification',
            text: `Your OTP for login is ${otp}.`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error);
            }
            else {
                console.log('Email sent:', info.response);
            }
        });
        return { otp, hashedOTP };
    });
}
exports.default = generateOTP;
