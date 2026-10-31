"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
const getHealthStatus = (_req, res) => {
    res.status(200).json({
        success: true,
        status: 'ONLINE',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: 'Social Development Events Platform Server',
    });
};
exports.getHealthStatus = getHealthStatus;
