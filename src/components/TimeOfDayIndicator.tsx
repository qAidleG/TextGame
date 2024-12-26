import { TimeOfDay } from '../types/game';

interface TimeOfDayIndicatorProps {
  currentTime: TimeOfDay;
}

export default function TimeOfDayIndicator({ currentTime }: TimeOfDayIndicatorProps) {
  const timeSteps: TimeOfDay[] = ['MORNING', 'NOON', 'EVENING', 'NIGHT'];
  const currentIndex = timeSteps.indexOf(currentTime);

  return (
    <div className="flex items-center space-x-1">
      {timeSteps.map((time, index) => (
        <div key={time} className="flex-1 flex items-center">
          <div 
            className={`h-1 flex-1 rounded-full ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white bg-opacity-30'
            }`}
          />
          {index < timeSteps.length - 1 && (
            <div 
              className={`w-2 h-2 rounded-full ${
                index < currentIndex 
                  ? 'bg-white' 
                  : index === currentIndex 
                    ? 'bg-white animate-pulse' 
                    : 'bg-white bg-opacity-30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
} 