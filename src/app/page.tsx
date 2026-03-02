"use client";

import { useState, useEffect } from 'react';
import Reader from '@/components/Reader';
import ChoiceSelector, { Choice } from '@/components/ChoiceSelector';
import HUD from '@/components/HUD';
import { useStoryStore } from '@/lib/store';
import { BookOpen, Loader2 } from 'lucide-react';

export default function Home() {
  const {
    sessionId,
    title,
    cast,
    setting,
    hiddenHealth,
    storyHistory,
    currentChapter,
    globalPageOffset,
    fontSize,
    isGameOver,
    initializeStory,
    updateHealth,
    addHistory,
    incrementChapter,
    addGlobalPages,
    setGameOver
  } = useStoryStore();

  const [currentNarrative, setCurrentNarrative] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  // If no session exists, we auto-generate the true E-Book Anthology start
  useEffect(() => {
    if (!sessionId && !isLoading && !initError) {
      startNewAnthology();
    } else if (sessionId && currentChapter > 0 && currentNarrative === '') {
      // Rehydrated state
      setCurrentNarrative(storyHistory[storyHistory.length - 1]);
    }
  }, [sessionId, currentChapter]);

  const startNewAnthology = async () => {
    setIsLoading(true);
    setInitError(false);
    try {
      const res = await fetch('/api/story/init', { method: 'POST' });
      if (!res.ok) throw new Error("Failed to init story");
      const data = await res.json();

      const newSessionId = crypto.randomUUID();
      initializeStory(newSessionId, data.title, data.cast, data.setting, data.narrative);
      setCurrentNarrative(data.narrative);
      setChoices(data.choices);
      // Ensure health and offset is reset just in case
      useStoryStore.setState({ hiddenHealth: 80, isGameOver: false, globalPageOffset: 0 });
    } catch (e) {
      console.error(e);
      setInitError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionText: string, healthImpact: number = 0) => {
    setIsLoading(true);
    setChoices([]);

    if (healthImpact !== 0) {
      updateHealth(healthImpact);
    }

    try {
      const resp = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cast,
          setting,
          hiddenHealth,
          storyHistory,
          actionTaken: actionText
        })
      });

      if (!resp.ok) throw new Error("Failed to fetch story");

      const data = await resp.json();

      setCurrentNarrative(data.narrative);
      setChoices(data.choices);
      addHistory(data.narrative);
      incrementChapter();
      addGlobalPages(totalPages);

      if (hiddenHealth <= 0 || currentChapter >= 12) {
        setGameOver(true);
      }

    } catch (error) {
      console.error(error);
      setCurrentNarrative("The pages blur together. A profound distortion warps the text... Please try turning the page again.");
    } finally {
      setIsLoading(false);
    }
  };

  // True E-Book Loading Screen
  if (!sessionId || isLoading && currentChapter === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-1000">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-6 opacity-40 text-[var(--color-primary)] animate-spin" />
          <h1 className="text-2xl font-serif tracking-widest uppercase opacity-60 animate-pulse">Writing a new story...</h1>
          {initError && (
            <div className="mt-8">
              <p className="text-red-500 font-sans mb-4">The author hit writer's block. Please try again.</p>
              <button onClick={startNewAnthology} className="px-6 py-2 border rounded border-[var(--color-primary)] opacity-70 hover:opacity-100">Retry</button>
            </div>
          )}
        </div>
      </main>
    );
  }

  // displayPage is the monotonic global page count + current local chunk page
  const displayPage = globalPageOffset + currentPage;

  // True E-Book Reading Screen
  return (
    <main className="min-h-screen flex flex-col p-4 sm:p-8 md:p-16 lg:p-24 transition-colors duration-1000 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <HUD title={title} chapter={currentChapter} displayPage={displayPage} />

      <div className="flex-1 max-w-2xl mx-auto w-full pt-8">
        <header className="mb-16 text-center border-b border-[var(--color-primary)] border-opacity-20 pb-8 relative">
          <h1
            className="font-serif font-bold text-[var(--color-text-primary)] tracking-tight mb-4 leading-tight transition-all duration-300"
            style={{ fontSize: `${Math.max(30, fontSize * 2)}px`, lineHeight: 1.2 }}
          >
            {title}
          </h1>
        </header>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 opacity-40 text-[var(--color-primary)] animate-spin" />
            <p className="font-sans text-xs uppercase tracking-widest opacity-50">Generating Narrative...</p>
          </div>
        ) : (
          <div className="pb-64 relative">
            <Reader
              content={currentNarrative}
              fontSize={fontSize}
              onPageChange={(c, t) => { setCurrentPage(c); setTotalPages(t); }}
              onLastPage={(val) => { console.log('isLastPage event:', val); setIsLastPage(val); }}
            />

            {isGameOver ? (
              <div className="mt-20 text-center font-sans">
                <p className="italic font-serif text-xl mb-12 opacity-80">
                  {hiddenHealth <= 0 ? "The pages tear away into absolute darkness." : "The final chapter concludes in silent victory."}
                </p>
                <div className="w-16 h-px bg-[var(--color-primary)] opacity-30 mx-auto mb-12"></div>
                <button
                  onClick={() => {
                    useStoryStore.getState().resetAdventure();
                    window.location.reload();
                  }}
                  className="px-8 py-3 tracking-widest uppercase text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-primary)] transition-colors duration-300"
                >
                  Close Book & Start Anew
                </button>
              </div>
            ) : (
              <div className={`mt-16 relative z-50 transition-opacity duration-700 ${isLastPage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Decorative divider before choices */}
                <div className="w-8 h-px bg-[var(--color-primary)] opacity-30 mx-auto mb-16"></div>
                <ChoiceSelector
                  choices={choices}
                  onSelect={(choice) => handleAction(choice.text, choice.healthImpact)}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
