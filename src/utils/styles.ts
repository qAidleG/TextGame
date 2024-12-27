import { TimeOfDay } from '../types/game';

const COLORS = {
  MORNING: {
    from: 'from-amber-400',  // Gold (Morning) in top-left
    to: 'to-purple-900'      // Purple Blue (Night) in bottom-right
  },
  NOON: {
    from: 'from-sky-400',    // Light Blue (Noon) in top-left
    to: 'to-amber-400'       // Gold (Morning) in bottom-right
  },
  EVENING: {
    from: 'from-blue-900',   // Dark Blue (Evening) in top-left
    to: 'to-sky-400'         // Light Blue (Noon) in bottom-right
  },
  NIGHT: {
    from: 'from-purple-900', // Purple Blue (Night) in top-left
    to: 'to-blue-900'        // Dark Blue (Evening) in bottom-right
  }
};

export const getBackgroundGradient = (timeOfDay: TimeOfDay) => {
  const colors = COLORS[timeOfDay];
  if (!colors) {
    console.error(`Invalid time of day: ${timeOfDay}`);
    return 'bg-gradient-to-br from-gray-900 to-black'; // Fallback gradient
  }
  return `bg-gradient-to-br ${colors.from} ${colors.to} transition-colors duration-1000`;
}; 