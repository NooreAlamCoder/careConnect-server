import { EventType } from '../types';

export const VALID_EVENT_TYPES: EventType[] = [
  'Cleanup',
  'Plantation',
  'Donation',
  'Education',
  'Healthcare',
  'Other',
];

export const isValidEventType = (type: string): type is EventType => {
  return VALID_EVENT_TYPES.includes(type as EventType);
};

export const isFutureDate = (dateStr: string): boolean => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const targetDate = new Date(dateStr).toISOString().split('T')[0];
    return targetDate >= today;
  } catch {
    return false;
  }
};

