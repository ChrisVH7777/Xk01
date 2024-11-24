import { parse, getDay, getHours } from 'date-fns';

const OPENING_HOURS = {
  0: { open: 8, close: 16 },  // Sunday
  1: { open: 7, close: 20 },  // Monday
  2: { open: 7, close: 20 },  // Tuesday
  3: { open: 7, close: 20 },  // Wednesday
  4: { open: 7, close: 20 },  // Thursday
  5: { open: 7, close: 20 },  // Friday
  6: { open: 8, close: 20 },  // Saturday
};

export function isWithinOpeningHours(date: Date): boolean {
  const day = getDay(date);
  const hour = getHours(date);
  const hours = OPENING_HOURS[day as keyof typeof OPENING_HOURS];
  
  return hour >= hours.open && hour < hours.close;
}