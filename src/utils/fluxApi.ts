interface FluxGenerateResponse {
  id: string;
}

interface FluxResultResponse {
  id: string;
  status: string;
  result: {
    sample?: string;
    prompt?: string;
    seed?: number;
    start_time?: number;
    end_time?: number;
  };
}

export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  try {
    console.log('Starting image generation with prompt:', prompt);
    
    const requestPayload = {
      prompt,
      width: 1024,
      height: 768,
      prompt_upsampling: false,
      safety_tolerance: 6,
      output_format: 'jpeg'
    };
    
    console.log('Sending request to Flux API:', {
      url: 'https://api.bfl.ml/v1/flux-pro-1.1',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': '***' // Hide actual key in logs
      },
      payload: requestPayload
    });
    
    // Submit generation request
    const generateResponse = await fetch('https://api.bfl.ml/v1/flux-pro-1.1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Key': apiKey
      },
      body: JSON.stringify(requestPayload)
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Generation request failed:', errorText);
      throw new Error(`Failed to submit image generation request: ${generateResponse.status} ${errorText}`);
    }

    const { id } = await generateResponse.json() as FluxGenerateResponse;
    console.log('Generation request submitted, got ID:', id);

    // Start polling immediately
    const pollInterval = 500; // Poll every 500ms
    const maxAttempts = 16; // 16 attempts * 500ms = 8 seconds total
    let attempts = 0;
    
    // First poll immediately without waiting
    const checkResult = async () => {
      const resultResponse = await fetch(`https://api.bfl.ml/v1/get_result?id=${id}`, {
        headers: {
          'X-Key': apiKey
        }
      });

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error('Result request failed:', errorText);
        throw new Error(`Failed to get generation result: ${resultResponse.status} ${errorText}`);
      }

      const result = await resultResponse.json() as FluxResultResponse;
      console.log('Poll result status:', result.status);

      if (result.status === 'Ready' && result.result.sample) {
        console.log('Image generation completed successfully');
        return result.result.sample;
      } else if (result.status === 'Failed') {
        throw new Error('Image generation failed on server');
      }
      return null;
    };

    // First check immediately
    let imageUrl = await checkResult();
    if (imageUrl) return imageUrl;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Polling attempt ${attempts}/${maxAttempts}`);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      imageUrl = await checkResult();
      if (imageUrl) return imageUrl;
    }

    throw new Error(`Image generation timed out after ${maxAttempts * (pollInterval/1000)} seconds`);
  } catch (error) {
    console.error('Flux API Error:', error);
    // Return a placeholder image URL if generation fails
    return 'https://placehold.co/1024x768/png?text=Image+Generation+Failed';
  }
} 