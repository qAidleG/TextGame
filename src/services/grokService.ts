import { GameContext, generatePrompt, RESPONSE_STRUCTURE } from '../config/grokInstructions';

export class GrokService {
  private apiKey: string | null = null;
  private context: GameContext;

  constructor() {
    this.apiKey = localStorage.getItem('grokApiKey');
    this.context = this.loadContext();
  }

  private loadContext(): GameContext {
    const savedContext = localStorage.getItem('gameContext');
    return savedContext ? JSON.parse(savedContext) : this.getInitialContext();
  }

  private getInitialContext(): GameContext {
    return {
      timeOfDay: 'MORNING',
      essence: 0,
      inventory: [],
      visitedLocations: ['starting_room'],
      completedQuests: [],
      relationships: {},
      currentLocation: 'starting_room'
    };
  }

  private saveContext(): void {
    localStorage.setItem('gameContext', JSON.stringify(this.context));
  }

  public updateContext(updates: Partial<GameContext>): void {
    this.context = { ...this.context, ...updates };
    this.saveContext();
  }

  public async processAction(action: string): Promise<typeof RESPONSE_STRUCTURE> {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure it in settings.');
    }

    try {
      const prompt = generatePrompt(this.context, action);
      
      const response = await fetch('https://xai.games/api/grok-2-1212', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Grok API');
      }

      const data = await response.json();
      return this.parseResponse(data.choices[0].text);

    } catch (error) {
      console.error('Error processing action:', error);
      throw error;
    }
  }

  private parseResponse(responseText: string): typeof RESPONSE_STRUCTURE {
    try {
      // Assuming the API returns a structured response matching RESPONSE_STRUCTURE
      const parsed = JSON.parse(responseText);
      
      // Update context based on response
      if (parsed.metadata?.essenceChange) {
        this.context.essence += parsed.metadata.essenceChange;
      }
      
      if (parsed.metadata?.newLocation) {
        this.context.currentLocation = parsed.metadata.newLocation;
        if (!this.context.visitedLocations.includes(parsed.metadata.newLocation)) {
          this.context.visitedLocations.push(parsed.metadata.newLocation);
        }
      }

      this.saveContext();
      return parsed;

    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('Invalid response format from API');
    }
  }

  public getContext(): GameContext {
    return { ...this.context };
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem('grokApiKey', key);
  }
} 