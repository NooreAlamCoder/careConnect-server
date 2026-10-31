"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFutureDate = exports.isValidEventType = exports.VALID_EVENT_TYPES = void 0;
exports.VALID_EVENT_TYPES = [
    'Cleanup',
    'Plantation',
    'Donation',
    'Education',
    'Healthcare',
    'Other',
];
const isValidEventType = (type) => {
    return exports.VALID_EVENT_TYPES.includes(type);
};
exports.isValidEventType = isValidEventType;
const isFutureDate = (dateStr) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const targetDate = new Date(dateStr).toISOString().split('T')[0];
        return targetDate >= today;
    }
    catch {
        return false;
    }
};
exports.isFutureDate = isFutureDate;
