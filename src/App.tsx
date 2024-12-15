import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { NoteInput } from './components/NoteInput';
import { ProcessedNote } from './components/ProcessedNote';
import { Note, NoteFormData } from './types';
import { processNoteWithAPI } from './services/api';
import { buildPrompt } from './utils/prompts/promptBuilder';

function App() {
  const [note, setNote] = useState<Note | null>(null);

  const clearNote = () => {
    setNote(null);
  };

  const processNote = async ({ content, promptType, noteType, customInstructions, guidedResponses }: NoteFormData) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      isProcessing: true
    };
    setNote(newNote);

    try {
      const data = await processNoteWithAPI({ 
        content,
        prompt: buildPrompt(promptType, noteType, customInstructions, guidedResponses),
      });
      
      setNote(prev => prev ? {
        ...prev,
        processedContent: data.processedContent,
        isProcessing: false
      } : null);
    } catch (error) {
      console.error('Processing error:', error);
      setNote(prev => prev ? {
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process note. Please try again.',
        isProcessing: false
      } : null);
    }
  };
  const handleReprocess = async (instructions: string) => {
    if (!note) return;
    
    setNote(prev => prev ? {
      ...prev,
      isProcessing: true,
      additionalInstructions: instructions
    } : null);

    try {
      const data = await processNoteWithAPI({
        content: note.processedContent || '',
        prompt: `Please refine the following clinical documentation based on these instructions: ${instructions}\n\nOriginal documentation to refine:\n`,
        originalContent: note.originalContent
      });

      setNote(prev => prev ? {
        ...prev,
        processedContent: data.processedContent,
        isProcessing: false
      } : null);
    } catch (error) {
      console.error('Reprocessing error:', error);
      setNote(prev => prev ? {
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to reprocess note. Please try again.',
        isProcessing: false
      } : null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <header className="mb-12">
          <div className="flex items-center justify-center gap-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sano</h1>
              <span className="text-sm sm:text-lg text-gray-500">Clinical Documentation Assistant</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://buy.stripe.com/9AQcQ70C04SzbqE7st"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              ❤️ Support Development
            </a>
          </div>
        </header>

        <div className="space-y-8">
          <NoteInput 
            onSubmit={processNote}
            onClear={clearNote}
            isProcessing={note?.isProcessing || false}
          />
          {note && <ProcessedNote note={note} onReprocess={handleReprocess} />}
        </div>
      </div>
    </div>
  );
}

export default App;