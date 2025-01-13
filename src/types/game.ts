export type TimeOfDay = 'MORNING' | 'NOON' | 'EVENING' | 'NIGHT';

export interface GameState {
  currentScene: string;
  timeOfDay: TimeOfDay;
  inventory: string[];
  stats: {
    health: number;
    energy: number;
  };
}

export interface DialogOption {
  text: string;
  action: () => void;
  condition?: () => boolean;
}

export interface GameScene {
  id: string;
  description: string;
  dialog: string;
  options: DialogOption[];
  background?: string;
} 