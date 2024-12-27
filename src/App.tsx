import { useState } from 'react'
import MainMenu from './components/MainMenu'
import GameScreen from './components/GameScreen'
import SettingsScreen from './components/SettingsScreen'
import { TimeOfDay } from './types/game'
import { INTRO_SCENE, RULES } from './config/gameLore'
import { ResponseStructure } from './config/grokInstructions'

type Screen = 'menu' | 'game' | 'settings'

export interface GameState {
  timeOfDay: TimeOfDay;
  day: number;
  essence: number;
  phase: 'intro' | 'cottage_built' | 'exploring';
  scene: {
    sceneText: string;
    dialogText: string;
    sceneImage?: string;
    options: Array<{
      text: string;
      action: () => void;
    }>;
  };
  dayRecap?: ResponseStructure['metadata']['dailyRecap'];
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')
  const [previousScreen, setPreviousScreen] = useState<Screen>('menu')
  const [gameState, setGameState] = useState<GameState>({
    timeOfDay: 'EVENING',
    day: 1,
    essence: RULES.essence.start,
    phase: 'intro',
    scene: {
      sceneText: INTRO_SCENE.setup.context,
      dialogText: INTRO_SCENE.plant.description,
      options: []
    }
  })

  const navigateTo = (screen: Screen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu 
          onNewGame={() => navigateTo('game')}
          onLoadGame={() => navigateTo('game')}
          onSettings={() => navigateTo('settings')}
        />
      case 'game':
        return <GameScreen 
          gameState={gameState}
          setGameState={setGameState}
          onExit={() => navigateTo('menu')}
          onSettings={() => navigateTo('settings')}
        />
      case 'settings':
        return <SettingsScreen 
          onBack={() => navigateTo(previousScreen)}
        />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {renderScreen()}
    </div>
  )
}

export default App
