import { useState, useEffect } from 'react';
import { TimeOfDay } from '../types/game';
import { getBackgroundGradient } from '../utils/styles';
import TimeOfDayIndicator from './TimeOfDayIndicator';
import { INTRO_SCENE, RULES, API_INSTRUCTIONS } from '../config/gameLore';
import { ResponseStructure } from '../config/grokInstructions';
import {
  SparklesIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  Cog6ToothIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { generateImage } from '../utils/fluxApi';
import { GameState } from '../App';

interface GameScreenProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  onExit: () => void;
  onSettings: () => void;
}

interface GameOption {
  text: string;
  action?: () => void;
}

export default function GameScreen({ gameState, setGameState, onExit, onSettings }: GameScreenProps) {
  const [isEssenceChanging, setIsEssenceChanging] = useState(false);
  const [showExitOptions, setShowExitOptions] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [hideUI, setHideUI] = useState(false);

  // Add useEffect to handle essence changes
  useEffect(() => {
    if (isEssenceChanging) {
      const timer = setTimeout(() => {
        setIsEssenceChanging(false);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isEssenceChanging]);

  // Modify setEssence calls to trigger animation
  const updateEssence = (newValue: number) => {
    setGameState(prev => ({ ...prev, essence: newValue }));
    setIsEssenceChanging(true);
  };

  const handleNurturePlant = () => {
    if (gameState.essence >= INTRO_SCENE.plant.cost) {
      updateEssence(gameState.essence - INTRO_SCENE.plant.cost);
      setGameState(prev => ({
        ...prev,
        phase: 'cottage_built',
        timeOfDay: 'NIGHT',
        scene: {
          ...prev.scene,
          sceneText: INTRO_SCENE.plant.growth_text,
          dialogText: "Your new home awaits...",
          options: []
        }
      }));
    }
  };

  const handleExploreHome = async () => {
    setGameState(prev => ({ ...prev, phase: 'exploring' }));
    
    // Get the API keys from settings
    const grokApiKey = localStorage.getItem('grokApiKey');
    const fluxApiKey = localStorage.getItem('fluxApiKey');
    
    if (!grokApiKey || !fluxApiKey) {
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "Please set your API keys in the settings first.",
          dialogText: "You'll need both API keys to continue.",
          options: []
        }
      }));
      return;
    }

    try {
      // First, get the scene description from Grok
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grokApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "grok-2-1212",
          messages: [
            {
              role: "system",
              content: [{ 
                type: "text", 
                text: JSON.stringify({
                  currentState: {
                    phase: 'exploring',
                    essence: gameState.essence,
                    timeOfDay: gameState.timeOfDay
                  },
                  gameLore: RULES,
                  instructions: API_INSTRUCTIONS
                })
              }]
            },
            {
              role: "user",
              content: [{ 
                type: "text", 
                text: "The player has just grown their cottage from a magical flower and clicked 'Explore your new home'. This is their first interaction with the game world. Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the scene and atmosphere), dialogText: string (must start with 'Speaker: ' followed by the message), imagePrompt: string (a detailed prompt for generating an image of the scene), options: Array<{ text: string }> }"
              }]
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const cleanedResponse = responseText.replace(/```json\n|\n```/g, '').trim();
      const apiResponse = JSON.parse(cleanedResponse);

      // Update text and options immediately
      setGameState(prev => ({
        ...prev,
        timeOfDay: apiResponse.timeOfDay,
        scene: {
          ...prev.scene,
          sceneText: apiResponse.sceneText,
          dialogText: apiResponse.dialogText,
          options: apiResponse.options.map((opt: GameOption) => ({
            text: opt.text,
            action: async () => await handleOptionSelect(opt)
          }))
        }
      }));

      // Generate new image in the background if prompt exists
      if (apiResponse.imagePrompt) {
        generateImage(apiResponse.imagePrompt, fluxApiKey).then(newImage => {
          setGameState(prev => ({
            ...prev,
            scene: {
              ...prev.scene,
              sceneImage: newImage
            }
          }));
        }).catch(error => {
          console.error('Image generation failed:', error);
          // Keep the existing image on failure
        });
      }

    } catch (error) {
      console.error('API Error:', error);
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "There was an error connecting to the game's magic. Please try again or check your settings.",
          dialogText: "Connection error",
          options: []
        }
      }));
    }
  };

  const handleOptionSelect = async (opt: GameOption) => {
    const apiKey = localStorage.getItem('grokApiKey');
    if (!apiKey) {
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "Please set your API key in the settings first.",
          dialogText: "Narrator: You'll need an API key to continue.",
          options: []
        }
      }));
      return;
    }

    // Show loading state while preserving the image and scene
    setGameState(prev => ({
      ...prev,
      scene: {
        ...prev.scene,
        sceneText: "...",
        dialogText: "...",
        options: []
      }
    }));

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "grok-2-1212",
          messages: [
            {
              role: "system",
              content: [{ 
                type: "text", 
                text: JSON.stringify({
                  currentState: {
                    phase: 'exploring',
                    essence: gameState.essence,
                    timeOfDay: gameState.timeOfDay,
                    lastScene: gameState.scene
                  },
                  gameLore: RULES,
                  instructions: API_INSTRUCTIONS,
                  selectedOption: opt
                })
              }]
            },
            {
              role: "user",
              content: [{ 
                type: "text", 
                text: `The player has selected: "${opt.text}". Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the scene and atmosphere), dialogText: string (must start with 'Speaker: ' followed by the message), imagePrompt: string (a detailed prompt for generating an image of the scene and any speaking characters), options: Array<{ text: string }> }`
              }]
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const cleanedResponse = responseText.replace(/```json\n|\n```/g, '').trim();
      const apiResponse = JSON.parse(cleanedResponse);

      setGameState(prev => ({
        ...prev,
        timeOfDay: apiResponse.timeOfDay,
        scene: {
          ...prev.scene,
          sceneText: apiResponse.sceneText,
          dialogText: apiResponse.dialogText,
          options: apiResponse.options.map((newOpt: GameOption) => ({
            text: newOpt.text,
            action: async () => await handleOptionSelect(newOpt)
          }))
        }
      }));
    } catch (error) {
      console.error('Option Selection Error:', error);
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "There was an error processing your choice. Please try again or check your settings.",
          dialogText: "Narrator: Something went wrong with the magic...",
          options: []
        }
      }));
    }
  };

  const handleSleep = async () => {
    try {
      const apiKey = localStorage.getItem('grokApiKey');
      if (!apiKey) {
        setGameState(prev => ({
          ...prev,
          scene: {
            ...prev.scene,
            sceneText: "Please set your API key in the settings first.",
            dialogText: "Narrator: You'll need an API key to continue.",
            options: []
          }
        }));
        return;
      }

      // Show loading state
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "...",
          dialogText: "...",
          options: []
        }
      }));

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "grok-2-1212",
          messages: [
            {
              role: "system",
              content: [{ 
                type: "text", 
                text: JSON.stringify({
                  currentState: {
                    phase: gameState.phase,
                    essence: gameState.essence,
                    timeOfDay: gameState.timeOfDay,
                    lastScene: gameState.scene
                  },
                  gameLore: RULES,
                  instructions: API_INSTRUCTIONS
                })
              }]
            },
            {
              role: "user",
              content: [{ 
                type: "text", 
                text: "The player has chosen to sleep until morning. Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the morning scene and atmosphere), dialogText: string (must start with 'Speaker: ' followed by the message), imagePrompt: string (a detailed prompt for generating an image of the morning scene), options: Array<{ text: string }> }"
              }]
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const cleanedResponse = responseText.replace(/```json\n|\n```/g, '').trim();
      const apiResponse = JSON.parse(cleanedResponse);

      // Update game state for morning
      setGameState(prev => ({
        ...prev,
        day: prev.day + 1,
        timeOfDay: 'MORNING',
        scene: {
          ...prev.scene,
          sceneText: apiResponse.sceneText,
          dialogText: apiResponse.dialogText,
          options: apiResponse.options.map((opt: GameOption) => ({
            text: opt.text,
            action: async () => await handleOptionSelect(opt)
          }))
        }
      }));

      // Generate new image if prompt exists
      if (apiResponse.imagePrompt) {
        const fluxApiKey = localStorage.getItem('fluxApiKey');
        if (fluxApiKey) {
          generateImage(apiResponse.imagePrompt, fluxApiKey).then(newImage => {
            setGameState(prev => ({
              ...prev,
              scene: {
                ...prev.scene,
                sceneImage: newImage
              }
            }));
          }).catch(error => {
            console.error('Image generation failed:', error);
          });
        }
      }

    } catch (error) {
      console.error('Sleep Action Error:', error);
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "There was an error processing your rest. Please try again.",
          dialogText: "Narrator: Something went wrong with the magic...",
          options: []
        }
      }));
    }
  };

  const handleCustomResponse = async () => {
    if (!textInput.trim()) return;
    
    const input = textInput.trim();
    setTextInput('');
    setShowTextInput(false);
    
    // Show loading state
    setGameState(prev => ({
      ...prev,
      scene: {
        ...prev.scene,
        sceneText: "...",
        dialogText: "...",
        options: []
      }
    }));

    try {
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('grokApiKey')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "grok-2-1212",
          messages: [
            {
              role: "system",
              content: [{ 
                type: "text", 
                text: JSON.stringify({
                  currentState: {
                    phase: 'exploring',
                    essence: gameState.essence,
                    timeOfDay: gameState.timeOfDay,
                    lastScene: gameState.scene
                  },
                  gameLore: RULES,
                  instructions: API_INSTRUCTIONS
                })
              }]
            },
            {
              role: "user",
              content: [{ 
                type: "text", 
                text: `The player says: "${input}". Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the scene and atmosphere, with a focus on erotic elements), dialogText: string (must start with 'Speaker: ' followed by a sexually suggestive or explicit message), imagePrompt: string (a detailed prompt for generating an image of the scene and any speaking characters, including their sexual activities), options: Array<{ text: string }> }`
              }]
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        })
      });

      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const cleanedResponse = responseText.replace(/```json\n|\n```/g, '').trim();
      const apiResponse = JSON.parse(cleanedResponse);

      // Update state with response
      setGameState(prev => ({
        ...prev,
        timeOfDay: apiResponse.timeOfDay,
        scene: {
          ...prev.scene,
          sceneText: apiResponse.sceneText,
          dialogText: apiResponse.dialogText,
          options: apiResponse.options.map((opt: GameOption) => ({
            text: opt.text,
            action: async () => await handleOptionSelect(opt)
          }))
        }
      }));

      // Generate new image if prompt exists
      if (apiResponse.imagePrompt) {
        const fluxApiKey = localStorage.getItem('fluxApiKey');
        if (fluxApiKey) {
          generateImage(apiResponse.imagePrompt, fluxApiKey).then(newImage => {
            setGameState(prev => ({
              ...prev,
              scene: {
                ...prev.scene,
                sceneImage: newImage
              }
            }));
          }).catch(error => {
            console.error('Image generation failed:', error);
          });
        }
      }
    } catch (error) {
      console.error('Custom Response Error:', error);
      setGameState(prev => ({
        ...prev,
        scene: {
          ...prev.scene,
          sceneText: "There was an error processing your response. Please try again.",
          dialogText: "Narrator: Something went wrong with the magic...",
          options: []
        }
      }));
    }
  };

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  return (
    // Full screen background
    <div className="min-h-screen w-full bg-black flex justify-center items-center">
      {/* Game container with mobile phone aspect ratio (1080x1920 = 9:16) */}
      <div className="h-screen max-h-[calc(100vw*16/9)] aspect-[9/16] relative flex flex-col bg-black">
        {/* Gradient background */}
        <div className={`absolute inset-0 ${getBackgroundGradient(gameState.timeOfDay)}`} />
        
        {/* Scene Image - Full height background */}
        {gameState.scene.sceneImage && (
          <div className="absolute inset-2 rounded-2xl overflow-hidden">
            <img 
              src={gameState.scene.sceneImage} 
              alt="Scene" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Hide/Show UI Button */}
        <button
          onClick={() => setHideUI(!hideUI)}
          className="absolute top-4 right-4 z-50 bg-black bg-opacity-40 hover:bg-opacity-60 
                     backdrop-blur-sm text-white p-2 rounded-full transition-all"
        >
          {hideUI ? (
            <EyeIcon className="w-6 h-6" />
          ) : (
            <EyeSlashIcon className="w-6 h-6" />
          )}
        </button>
        
        {/* Game content */}
        <div className={`relative flex flex-col h-full transition-opacity duration-300 ${hideUI ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Top Bar */}
          <div className="bg-black bg-opacity-20 backdrop-blur-sm p-2">
            <div className="container mx-auto flex justify-between items-center">
              {/* Time of Day Indicator */}
              <TimeOfDayIndicator currentTime={gameState.timeOfDay} day={gameState.day} />
              
              {/* Essence Display */}
              <div className="flex items-center text-white text-base font-semibold gap-1.5 pr-4">
                <span className="flex items-center gap-1">
                  <span className="text-xl font-bold text-amber-400">⟠</span>
                  <span className={isEssenceChanging ? 'essence-change' : ''}>{gameState.essence}</span>
                </span>
                <SparklesIcon className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Game Content */}
            <div className="space-y-4 relative h-full">
              {/* Content overlay */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Spacer to push content to bottom */}
                <div className="flex-1" />

                {/* Scene Description */}
                <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 mb-2">
                  <p className="text-white text-lg font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {gameState.scene.sceneText}
                  </p>
                </div>

                {/* Dialog */}
                <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <p className="text-white text-lg font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    {gameState.scene.dialogText}
                  </p>
                </div>

                {/* Dialog Options */}
                <div className="space-y-2 mb-4">
                  {gameState.phase === 'intro' ? (
                    <button
                      onClick={handleNurturePlant}
                      disabled={gameState.essence < INTRO_SCENE.plant.cost}
                      className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 disabled:bg-opacity-20 
                               backdrop-blur-sm text-white p-3 rounded-lg transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    >
                      {INTRO_SCENE.buttons.nurture.text}
                    </button>
                  ) : gameState.phase === 'cottage_built' ? (
                    <button 
                      onClick={handleExploreHome}
                      className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 
                                 backdrop-blur-sm text-white p-3 rounded-lg transition-all drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    >
                      Explore your new home
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {/* Text Input */}
                      {showTextInput ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCustomResponse()}
                            placeholder="Type your response..."
                            className="flex-1 bg-black bg-opacity-40 backdrop-blur-sm text-white p-3 rounded-lg 
                                      border border-gray-600 focus:border-indigo-400 outline-none"
                          />
                          <button
                            onClick={handleCustomResponse}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg"
                          >
                            Send
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowTextInput(true)}
                          className="w-full bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 
                                   backdrop-blur-sm text-white p-3 rounded-lg transition-all
                                   border border-indigo-400/30"
                        >
                          Type Custom Response
                        </button>
                      )}

                      {/* Existing Options */}
                      {gameState.scene.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={option.action}
                          className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 
                                   backdrop-blur-sm text-white p-3 rounded-lg transition-all"
                        >
                          {option.text}
                        </button>
                      ))}

                      {/* Sleep Option */}
                      {gameState.timeOfDay === 'NIGHT' && (
                        <button
                          onClick={handleSleep}
                          className="w-full bg-indigo-900 bg-opacity-60 hover:bg-opacity-70 
                                   backdrop-blur-sm text-white p-3 rounded-lg transition-all
                                   border border-indigo-400/30"
                        >
                          Sleep till tomorrow
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-black bg-opacity-20 backdrop-blur-sm p-2 grid grid-cols-5 gap-2">
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded flex flex-col items-center">
              <UserCircleIcon className="w-6 h-6" />
              <span className="text-[10px]">Stats</span>
            </button>
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded flex flex-col items-center">
              <ClipboardDocumentListIcon className="w-6 h-6" />
              <span className="text-[10px]">Quest</span>
            </button>
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded flex flex-col items-center">
              <MapIcon className="w-6 h-6" />
              <span className="text-[10px]">Map</span>
            </button>
            <button
              onClick={onSettings}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded flex flex-col items-center"
            >
              <Cog6ToothIcon className="w-6 h-6" />
              <span className="text-[10px]">Settings</span>
            </button>
            <button 
              onClick={() => setShowExitOptions(true)}
              className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded flex flex-col items-center"
            >
              <XCircleIcon className="w-6 h-6" />
              <span className="text-[10px]">Exit</span>
            </button>
          </div>
        </div>

        {/* Exit Dialog */}
        {showExitOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black bg-opacity-40 backdrop-blur-md rounded-lg p-6 max-w-sm w-full text-white">
              <h2 className="text-xl font-bold mb-4">Exit Game</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // TODO: Implement save and quit
                    onExit();
                  }}
                  className="bg-black bg-opacity-40 hover:bg-opacity-50 p-3 rounded-lg"
                >
                  Save and Quit
                </button>
                <button
                  onClick={onExit}
                  className="bg-red-900 bg-opacity-40 hover:bg-opacity-50 p-3 rounded-lg"
                >
                  Quit without Saving
                </button>
                <button
                  onClick={() => setShowExitOptions(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 