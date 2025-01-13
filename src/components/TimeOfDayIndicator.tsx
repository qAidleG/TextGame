import { TimeOfDay } from '../types/game';

interface TimeOfDayIndicatorProps {
  currentTime: TimeOfDay;
  day?: number;
}

const TIME_COLORS = {
  MORNING: 'bg-amber-400', // Gold
  NOON: 'bg-sky-400',     // Light Blue
  EVENING: 'bg-blue-900',  // Dark Blue
  NIGHT: 'bg-purple-900'   // Purple Blue
};

export default function TimeOfDayIndicator({ currentTime, day = 0 }: TimeOfDayIndicatorProps) {
  const timeSteps: TimeOfDay[] = ['MORNING', 'NOON', 'EVENING', 'NIGHT'];
  const currentIndex = timeSteps.indexOf(currentTime);

  // Format the day display
  const dayDisplay = day === 0 ? 'Night 0' : `Day ${day}`;

  return (
    <div className="flex flex-col gap-2 pl-4">
      {/* Day and Time Display */}
      <div className="text-white text-sm font-medium">
        {dayDisplay} - {currentTime}
      </div>
      
      {/* Time Indicator */}
      <div className="flex items-center gap-1">
        {timeSteps.map((time, index) => (
          <div key={time} className="flex items-center">
            {/* Diamond */}
            <div 
              className={`w-2 h-2 transform rotate-45 transition-all duration-500
                ${TIME_COLORS[time]} 
                ${index === currentIndex ? 'scale-125 ring-2 ring-white ring-opacity-50' : 'opacity-40'}
              `}
            />
            {/* Line connector */}
            {index < timeSteps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1
                ${index < currentIndex ? TIME_COLORS[timeSteps[index + 1]] : 'bg-white bg-opacity-20'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 