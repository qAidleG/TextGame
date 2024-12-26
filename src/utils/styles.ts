import { TimeOfDay } from '../types/game';

const COLORS = {
  MORNING: {
    from: 'from-amber-400', // Gold
    to: 'to-purple-900'     // Purple Blue (Night)
  },
  NOON: {
    from: 'from-sky-400',   // Light Blue
    to: 'to-amber-400'      // Gold
  },
  DUSK: {
    from: 'from-blue-900',  // Dark Blue
    to: 'to-sky-400'        // Light Blue
  },
  NIGHT: {
    from: 'from-purple-900', // Purple Blue
    to: 'to-blue-900'        // Dark Blue
  }
};

export const getBackgroundGradient = (timeOfDay: TimeOfDay) => {
  const colors = COLORS[timeOfDay];
  return `bg-gradient-to-br ${colors.from} ${colors.to} transition-colors duration-1000`;
}; 