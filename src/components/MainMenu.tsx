import { useState } from 'react';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
}

export default function MainMenu({ onNewGame, onLoadGame, onSettings }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold mb-8">Aethoria</h1>
        <div className="space-y-4">
          <button
            onClick={onNewGame}
            className="w-48 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
          >
            NEW GAME
          </button>
          <button
            onClick={onLoadGame}
            className="w-48 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors"
          >
            LOAD GAME
          </button>
          <button
            onClick={onSettings}
            className="w-48 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors"
          >
            SETTINGS
          </button>
        </div>
      </div>
    </div>
  );
} 