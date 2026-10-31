"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_change_in_production';
const createJWT = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            res.status(400).json({ success: false, message: 'Email is required' });
            return;
        }
        const payload = {
            email,
            name: name || '',
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            token,
        });
    }
    catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate token',
        });
    }
};
exports.createJWT = createJWT;
