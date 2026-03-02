import { Settings, RefreshCw, Moon, Sun, Book } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useStoryStore } from '@/lib/store';

interface SettingsOverlayProps {
    theme: string;
    setTheme: (theme: string) => void;
}

export default function SettingsOverlay({ theme, setTheme }: SettingsOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {
        resetAdventure,
        saveBookmark,
        deleteBookmark,
        loadBookmark,
        bookmarks,
        sessionId
    } = useStoryStore();

    const handleReset = () => {
        if (confirm("Close this book and start a new story entirely?")) {
            resetAdventure();
            setIsOpen(false);
            window.location.reload(); // Force full refresh for clean true-anthology start
        }
    };

    const handleSave = () => {
        saveBookmark();
        alert("Page bookmarked successfully.");
    };

    const handleLoad = (state: any) => {
        if (confirm("Load this bookmark? Current unsaved progress will be lost.")) {
            loadBookmark(state);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 p-2 rounded-full hover:bg-[var(--color-primary)] hover:bg-opacity-10 transition-colors text-[var(--color-primary)] opacity-50 hover:opacity-100"
                aria-label="Settings"
            >
                <Settings size={20} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center font-sans p-4">
                    <div className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-2xl max-w-md w-full border border-[var(--color-primary)] border-opacity-20 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-6 text-[var(--color-text-primary)] font-serif text-center uppercase tracking-widest">Options</h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-semibold mb-3 text-[var(--color-primary)] tracking-wider uppercase">Appearance</h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={cn(
                                            "flex-1 flex flex-col items-center p-3 rounded border transition-colors",
                                            theme === 'light' ? "border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]" : "border-[var(--color-primary)] border-opacity-20 opacity-60"
                                        )}
                                    >
                                        <Sun size={18} className="mb-2" />
                                        <span className="text-xs">Light</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('sepia')}
                                        className={cn(
                                            "flex-1 flex flex-col items-center p-3 rounded border transition-colors",
                                            theme === 'sepia' ? "border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]" : "border-[var(--color-primary)] border-opacity-20 opacity-60"
                                        )}
                                    >
                                        <Book size={18} className="mb-2" />
                                        <span className="text-xs">Sepia</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={cn(
                                            "flex-1 flex flex-col items-center p-3 rounded border transition-colors",
                                            theme === 'dark' ? "border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-primary)]" : "border-[var(--color-primary)] border-opacity-20 opacity-60"
                                        )}
                                    >
                                        <Moon size={18} className="mb-2" />
                                        <span className="text-xs">Dark</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-[var(--color-primary)] border-opacity-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-semibold text-[var(--color-primary)] tracking-wider uppercase">Bookmarks</h3>
                                    {sessionId && (
                                        <button
                                            onClick={handleSave}
                                            className="text-xs px-3 py-1 bg-[var(--color-primary)] text-[var(--color-bg-primary)] rounded hover:bg-opacity-80 transition-opacity"
                                        >
                                            Bookmark Page
                                        </button>
                                    )}
                                </div>

                                {bookmarks.length === 0 ? (
                                    <p className="text-sm opacity-50 italic text-center py-4">No bookmarks saved.</p>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {bookmarks.map((b) => (
                                            <div key={b.id} className="flex items-center justify-between p-3 border border-[var(--color-primary)] border-opacity-20 rounded gap-2 hover:bg-[var(--color-primary)] hover:bg-opacity-5 transition-colors">
                                                <div
                                                    className="flex-1 cursor-pointer overflow-hidden"
                                                    onClick={() => handleLoad(b.state)}
                                                >
                                                    <p className="font-serif font-bold text-sm truncate">{b.title}</p>
                                                    <p className="text-xs opacity-60">Pg. {b.chapter} • {b.date}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteBookmark(b.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 hover:bg-opacity-10 rounded opacity-60 hover:opacity-100 transition-all"
                                                    title="Delete Bookmark"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-[var(--color-primary)] border-opacity-10">
                                <button
                                    onClick={handleReset}
                                    className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors font-medium dark:bg-red-900/10 dark:hover:bg-red-900/30 text-sm"
                                >
                                    <RefreshCw size={16} />
                                    Generate New Story
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="mt-6 w-full p-3 font-serif uppercase tracking-widest text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-primary)] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
