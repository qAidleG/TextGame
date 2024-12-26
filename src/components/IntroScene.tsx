import { useState } from 'react';
import { INTRO_SCENE } from '../config/gameLore';

interface IntroSceneProps {
  onComplete: () => void;
  essence: number;
  onSpendEssence: (amount: number) => void;
}

export default function IntroScene({ onComplete, essence, onSpendEssence }: IntroSceneProps) {
  const [phase, setPhase] = useState<'seed' | 'growth'>('seed');

  const handleNurture = () => {
    if (essence >= INTRO_SCENE.plant.cost) {
      onSpendEssence(INTRO_SCENE.plant.cost);
      setPhase('growth');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Context */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {INTRO_SCENE.setup.location} - {INTRO_SCENE.setup.time}
          </h2>
          <p className="text-lg leading-relaxed">
            {INTRO_SCENE.setup.context}
          </p>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-lg">
            {phase === 'seed' 
              ? INTRO_SCENE.plant.description
              : INTRO_SCENE.plant.growth_text
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {phase === 'seed' ? (
            <button
              onClick={handleNurture}
              disabled={essence < INTRO_SCENE.plant.cost}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 
                         rounded-lg text-white font-medium transition-colors"
            >
              {INTRO_SCENE.buttons.nurture.text}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 
                         rounded-lg text-white font-medium transition-colors"
            >
              {INTRO_SCENE.buttons.continue.text}
            </button>
          )}
        </div>

        {/* Essence Display */}
        <div className="mt-4 text-lg">
          <span className="text-emerald-400">⟠{essence}</span> Essence Remaining
        </div>
      </div>
    </div>
  );
} 