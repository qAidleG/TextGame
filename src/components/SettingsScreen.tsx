import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [grokApiKey, setGrokApiKey] = useState('');
  const [fluxApiKey, setFluxApiKey] = useState('');
  const [showGrokKey, setShowGrokKey] = useState(false);
  const [showFluxKey, setShowFluxKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    // Load saved API keys on component mount
    const savedGrokKey = localStorage.getItem('grokApiKey') || '';
    const savedFluxKey = localStorage.getItem('fluxApiKey') || '';
    setGrokApiKey(savedGrokKey);
    setFluxApiKey(savedFluxKey);
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('grokApiKey', grokApiKey);
      localStorage.setItem('fluxApiKey', fluxApiKey);
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex justify-center items-center">
      <div className="h-screen aspect-[9/16] relative flex flex-col bg-gradient-to-b from-purple-900 to-black">
        <div className="relative flex flex-col h-full p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
          
          {/* Grok API Key Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Grok API Key
            </label>
            <div className="relative">
              <input
                type={showGrokKey ? 'text' : 'password'}
                value={grokApiKey}
                onChange={(e) => setGrokApiKey(e.target.value)}
                className="w-full bg-black bg-opacity-40 text-white p-3 rounded-lg pr-12"
                placeholder="Enter Grok API key"
              />
              <button
                onClick={() => setShowGrokKey(!showGrokKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showGrokKey ? (
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Flux API Key Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">
              Flux API Key
            </label>
            <div className="relative">
              <input
                type={showFluxKey ? 'text' : 'password'}
                value={fluxApiKey}
                onChange={(e) => setFluxApiKey(e.target.value)}
                className="w-full bg-black bg-opacity-40 text-white p-3 rounded-lg pr-12"
                placeholder="Enter Flux API key"
              />
              <button
                onClick={() => setShowFluxKey(!showFluxKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showFluxKey ? (
                  <EyeSlashIcon className="w-6 h-6" />
                ) : (
                  <EyeIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className="mb-4 text-center text-white">
              {saveStatus}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-auto space-y-4">
            <button
              onClick={handleSave}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors"
            >
              Save Settings
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 