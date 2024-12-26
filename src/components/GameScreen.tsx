import { useState } from 'react';
import { TimeOfDay } from '../types/game';
import { getBackgroundGradient } from '../utils/styles';
import TimeOfDayIndicator from './TimeOfDayIndicator';
import { INTRO_SCENE, RULES, API_INSTRUCTIONS } from '../config/gameLore';
import {
  SparklesIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  Cog6ToothIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { generateImage } from '../utils/fluxApi';

interface GameScreenProps {
  onExit: () => void;
  onSettings: () => void;
}

interface GameState {
  sceneText: string;
  dialogText: string;
  sceneImage?: string;
  options: Array<{
    text: string;
    action: () => void;
  }>;
}

export default function GameScreen({ onExit, onSettings }: GameScreenProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('MORNING');
  const [essence, setEssence] = useState(RULES.essence.start);
  const [showExitOptions, setShowExitOptions] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'cottage_built' | 'exploring'>('intro');
  const [gameState, setGameState] = useState<GameState>({
    sceneText: INTRO_SCENE.setup.context,
    dialogText: INTRO_SCENE.plant.description,
    options: []
  });

  const handleNurturePlant = () => {
    if (essence >= INTRO_SCENE.plant.cost) {
      setEssence(prev => prev - INTRO_SCENE.plant.cost);
      setPhase('cottage_built');
      setGameState({
        sceneText: INTRO_SCENE.plant.growth_text,
        dialogText: "Your new home awaits...",
        options: []
      });
    }
  };

  const handleExploreHome = async () => {
    setPhase('exploring');
    
    // Get the API keys from settings
    const grokApiKey = localStorage.getItem('grokApiKey');
    const fluxApiKey = localStorage.getItem('fluxApiKey');
    
    if (!grokApiKey || !fluxApiKey) {
      setGameState({
        sceneText: "Please set your API keys in the settings first.",
        dialogText: "You'll need both API keys to continue.",
        options: []
      });
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
                    essence: essence,
                    timeOfDay: timeOfDay
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

      // Generate the scene image using Flux
      const sceneImage = await generateImage(apiResponse.imagePrompt, fluxApiKey);
      
      setTimeOfDay(apiResponse.timeOfDay);
      setGameState({
        sceneText: apiResponse.sceneText,
        dialogText: apiResponse.dialogText,
        sceneImage,
        options: apiResponse.options.map(opt => ({
          text: opt.text,
          action: async () => {
            // Handle option selection through API
            const optionResponse = await fetch('https://api.x.ai/v1/chat/completions', {
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
                          essence: essence,
                          timeOfDay: timeOfDay,
                          lastScene: gameState
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
                      text: `The player has selected: "${opt.text}". Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the scene and atmosphere), dialogText: string (must start with 'Speaker: ' followed by the message), options: Array<{ text: string }> }`
                    }]
                  }
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: false
              })
            });

            if (!optionResponse.ok) {
              throw new Error('API call failed');
            }

            const optionData = await optionResponse.json();
            const optionResponseText = optionData.choices[0].message.content;
            const cleanedOptionResponse = optionResponseText.replace(/```json\n|\n```/g, '').trim();
            const optionApiResponse = JSON.parse(cleanedOptionResponse);

            setTimeOfDay(optionApiResponse.timeOfDay);
            setGameState({
              sceneText: optionApiResponse.sceneText,
              dialogText: optionApiResponse.dialogText,
              options: optionApiResponse.options.map(newOpt => ({
                text: newOpt.text,
                action: () => handleOptionSelect(newOpt)
              }))
            });
          }
        }))
      });

    } catch (error) {
      console.error('API Error:', error);
      setGameState({
        sceneText: "There was an error connecting to the game's magic. Please try again or check your settings.",
        dialogText: "Connection error",
        options: []
      });
    }
  };

  const handleOptionSelect = async (opt: { text: string }) => {
    const apiKey = localStorage.getItem('grokApiKey');
    if (!apiKey) {
      setGameState({
        sceneText: "Please set your API key in the settings first.",
        dialogText: "Narrator: You'll need an API key to continue.",
        options: []
      });
      return;
    }

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
                    essence: essence,
                    timeOfDay: timeOfDay,
                    lastScene: gameState
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
                text: `The player has selected: "${opt.text}". Please provide the next scene in JSON format with the following structure: { timeOfDay: string, sceneText: string (2-3 sentences describing the scene and atmosphere), dialogText: string (must start with 'Speaker: ' followed by the message), options: Array<{ text: string }> }`
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
      const apiResponse = JSON.parse(responseText);

      setTimeOfDay(apiResponse.timeOfDay);
      setGameState({
        sceneText: apiResponse.sceneText,
        dialogText: apiResponse.dialogText,
        options: apiResponse.options.map(newOpt => ({
          text: newOpt.text,
          action: () => handleOptionSelect(newOpt)
        }))
      });
    } catch (error) {
      console.error('Option Selection Error:', error);
      setGameState({
        sceneText: "There was an error processing your choice. Please try again or check your settings.",
        dialogText: "Narrator: Something went wrong with the magic...",
        options: []
      });
    }
  };

  return (
    // Full screen background
    <div className="min-h-screen w-full bg-black flex justify-center items-center">
      {/* Game container with 9:16 aspect ratio */}
      <div className="h-screen aspect-[9/16] relative flex flex-col">
        {/* Gradient background */}
        <div className={`absolute inset-0 ${getBackgroundGradient(timeOfDay)}`} />
        
        {/* Game content */}
        <div className="relative flex flex-col h-full">
          {/* Top Bar */}
          <div className="bg-black bg-opacity-20 backdrop-blur-sm p-2">
            <div className="container mx-auto flex flex-col gap-2">
              {/* Time of Day Indicator */}
              <TimeOfDayIndicator currentTime={timeOfDay} />
              
              {/* Essence Display */}
              <div className="flex justify-end items-center text-white gap-1">
                <span>⟠{essence}</span>
                <SparklesIcon className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Spacer to push content to bottom */}
            <div className="flex-1" />
            
            {/* Game Content at Bottom */}
            <div className="space-y-4">
              {/* Scene Image */}
              {gameState.sceneImage && (
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <img 
                    src={gameState.sceneImage} 
                    alt="Scene" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Scene Description */}
              <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 min-h-[100px]">
                <p className="text-white">
                  {gameState.sceneText}
                </p>
              </div>

              {/* Dialog */}
              <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 min-h-[100px]">
                <p className="text-white">
                  {gameState.dialogText}
                </p>
              </div>

              {/* Dialog Options */}
              <div className="space-y-2">
                {phase === 'intro' ? (
                  <button
                    onClick={handleNurturePlant}
                    disabled={essence < INTRO_SCENE.plant.cost}
                    className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 disabled:bg-opacity-20 
                             backdrop-blur-sm text-white p-3 rounded-lg transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {INTRO_SCENE.buttons.nurture.text}
                  </button>
                ) : phase === 'cottage_built' ? (
                  <button 
                    onClick={handleExploreHome}
                    className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 
                               backdrop-blur-sm text-white p-3 rounded-lg transition-all"
                  >
                    Explore your new home
                  </button>
                ) : (
                  <div className="space-y-2">
                    {gameState.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={option.action}
                        className="w-full bg-black bg-opacity-40 hover:bg-opacity-50 
                                 backdrop-blur-sm text-white p-3 rounded-lg transition-all"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
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
      </div>

      {/* Exit Dialog */}
      {showExitOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
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
  );
} 