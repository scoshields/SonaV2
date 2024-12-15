import { ProcessingOptions } from '../types';

const API_URL = '/.netlify/functions/process-note';

export async function processNoteWithAPI({ content, prompt }: ProcessingOptions) {
  try {
    // Validate input before making the request
    if (!content?.trim() && !prompt?.trim()) {
      throw new Error('Note content is required');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        content: content.trim(), 
        prompt: prompt.trim() 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || 
        `Server error (${response.status}): Please try again later`
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('JSON Parse Error:', error);
      throw new Error('Unable to process server response. Please try again.');
    }

    if (data?.processedContent === undefined || data?.processedContent === null) {
      throw new Error('Invalid response format: missing processedContent');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to process note. Please try again.';
    
    throw new Error(errorMessage);
  }
}