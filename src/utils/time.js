// Time utility functions for the game
import { 
  differenceInSeconds, 
  differenceInMinutes, 
  differenceInHours, 
  differenceInDays,
  addSeconds,
  formatDistance,
  formatDistanceToNow,
  parseISO
} from 'date-fns';

/**
 * Format a timespan in a user-friendly way
 * @param {Number} seconds - Total seconds to format
 * @returns {String} Formatted time string
 */
export const formatTimespan = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
};

/**
 * Calculate time remaining in a more readable format
 * @param {Date|String} endTime - End time (Date object or ISO string)
 * @returns {String} Formatted time remaining
 */
export const getTimeRemaining = (endTime) => {
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const now = new Date();
  
  if (now >= end) {
    return 'Complete';
  }
  
  const seconds = differenceInSeconds(end, now);
  return formatTimespan(seconds);
};

/**
 * Format a date or timestamp in a "time ago" format
 * @param {Date|String} date - Date to format
 * @returns {String} Formatted "time ago" string
 */
export const formatTimeAgo = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

/**
 * Calculate progress percentage between a start and end time
 * @param {Date|String} startTime - Start time
 * @param {Date|String} endTime - End time
 * @returns {Number} Progress percentage (0-100)
 */
export const calculateProgress = (startTime, endTime) => {
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const end = typeof endTime === 'string' ? new Date(endTime) : endTime;
  const now = new Date();
  
  if (now >= end) {
    return 100;
  }
  
  if (now <= start) {
    return 0;
  }
  
  const totalDuration = differenceInSeconds(end, start);
  const elapsed = differenceInSeconds(now, start);
  
  return Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
};

/**
 * Check if a date is in the past
 * @param {Date|String} date - Date to check
 * @returns {Boolean} True if date is in the past
 */
export const isPast = (date) => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  return checkDate < new Date();
};

/**
 * Add a duration to the current time and return an ISO string
 * @param {Number} seconds - Seconds to add to current time
 * @returns {String} Future date as ISO string
 */
export const addDuration = (seconds) => {
  return addSeconds(new Date(), seconds).toISOString();
};

export default {
  formatTimespan,
  getTimeRemaining,
  formatTimeAgo,
  calculateProgress,
  isPast,
  addDuration
};