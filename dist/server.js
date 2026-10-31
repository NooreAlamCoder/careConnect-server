"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const cors_2 = require("./config/cors");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const health_controller_1 = require("./controllers/health.controller");
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)({
    origin: cors_2.allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health Check Route
app.get('/', health_controller_1.getHealthStatus);
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/events', event_routes_1.default);
// Error Handling Middleware
app.use(error_middleware_1.errorHandler);
// Start Server and Connect DB
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
    }
    catch (error) {
        console.warn('⚠️ Server started in offline/standby mode for DB. Update server/.env with your MongoDB URI to enable database queries.');
    }
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
};
startServer();
