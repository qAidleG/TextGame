import { useState } from 'react'
import MainMenu from './components/MainMenu'
import GameScreen from './components/GameScreen'
import SettingsScreen from './components/SettingsScreen'

type Screen = 'menu' | 'game' | 'settings'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu')

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <MainMenu 
          onNewGame={() => setCurrentScreen('game')}
          onLoadGame={() => setCurrentScreen('game')}
          onSettings={() => setCurrentScreen('settings')}
        />
      case 'game':
        return <GameScreen 
          onExit={() => setCurrentScreen('menu')}
          onSettings={() => setCurrentScreen('settings')}
        />
      case 'settings':
        return <SettingsScreen 
          onBack={() => setCurrentScreen('menu')}
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
