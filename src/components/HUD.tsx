"use client";

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Sun, Moon, Book, BookOpen } from 'lucide-react';
import { useStoryStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface HUDProps {
    title: string;
    chapter: number;
    displayPage: number;
}

export default function HUD({ title, chapter, displayPage }: HUDProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const { theme, setTheme } = useTheme();
    const { saveBookmark, deleteBookmark, loadBookmark, bookmarks, sessionId, increaseFontSize, decreaseFontSize } = useStoryStore();

    const currentBookmark = bookmarks.find(b => b.chapter === chapter && b.state.sessionId === sessionId);

    const handleBookmarkToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentBookmark) {
            deleteBookmark(currentBookmark.id);
        } else {
            saveBookmark();
        }
    };

    const handleLoad = (state: any) => {
        if (confirm("Load this bookmark? Current unsaved progress will be lost.")) {
            loadBookmark(state);
            setShowBookmarks(false);
            setIsVisible(false);
        }
    };

    // Ensure mounted state if necessary, but we are keeping it simple for now as next-themes handles hydration
    return (
        <>
            {/* Invisible Tap Area covering the center of the screen */}
            <div
                className="fixed inset-y-32 inset-x-24 z-40 cursor-pointer"
                onClick={() => setIsVisible(!isVisible)}
            />

            {/* Top Bar */}
            <div className={cn(
                "fixed top-0 inset-x-0 h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-primary)] border-opacity-10 z-50 flex items-center justify-between px-6 transition-transform duration-300",
                isVisible ? "translate-y-0" : "-translate-y-full"
            )}>
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-sm tracking-widest uppercase">{title}</span>
                    <span className="font-sans text-[10px] uppercase opacity-60">Chapter {chapter}</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Typography toggles */}
                    <div className="flex items-center gap-1 opacity-70 border border-[var(--color-primary)] border-opacity-20 rounded p-1">
                        <button onClick={() => decreaseFontSize()} className="px-2 hover:bg-[var(--color-primary)] hover:bg-opacity-10 rounded font-serif text-sm font-bold" title="Decrease Font Size">A-</button>
                        <div className="w-px h-4 bg-[var(--color-primary)] opacity-20"></div>
                        <button onClick={() => increaseFontSize()} className="px-2 hover:bg-[var(--color-primary)] hover:bg-opacity-10 rounded font-serif text-lg font-bold" title="Increase Font Size">A+</button>
                    </div>

                    <div className="w-px h-6 bg-[var(--color-primary)] opacity-20 hidden sm:block"></div>

                    {/* Theme toggles in HUD for quick access */}
                    <div className="hidden sm:flex items-center gap-2 opacity-70">
                        <button onClick={() => setTheme('light')} className={cn("p-2 rounded hover:bg-[var(--color-primary)] hover:bg-opacity-10", theme === 'light' && "bg-[var(--color-primary)] bg-opacity-10")} title="Light"><Sun size={16} /></button>
                        <button onClick={() => setTheme('sepia')} className={cn("p-2 rounded hover:bg-[var(--color-primary)] hover:bg-opacity-10", theme === 'sepia' && "bg-[var(--color-primary)] bg-opacity-10")} title="Sepia"><Book size={16} /></button>
                        <button onClick={() => setTheme('dark')} className={cn("p-2 rounded hover:bg-[var(--color-primary)] hover:bg-opacity-10", theme === 'dark' && "bg-[var(--color-primary)] bg-opacity-10")} title="Dark"><Moon size={16} /></button>
                    </div>

                    <div className="w-px h-6 bg-[var(--color-primary)] opacity-20"></div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowBookmarks(true); }}
                            className="text-[var(--color-primary)] hover:opacity-70 transition-opacity p-2"
                            title="View Bookmarks"
                        >
                            <BookOpen size={20} />
                        </button>

                        <button
                            onClick={handleBookmarkToggle}
                            className="text-[var(--color-primary)] hover:opacity-70 transition-opacity p-2"
                            title={currentBookmark ? "Remove Bookmark" : "Bookmark Page"}
                        >
                            {currentBookmark ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={cn(
                "fixed bottom-0 inset-x-0 h-12 bg-[var(--color-bg-primary)] border-t border-[var(--color-primary)] border-opacity-10 z-50 flex items-center justify-center transition-transform duration-300",
                isVisible ? "translate-y-0" : "translate-y-full"
            )}>
                <span className="font-sans text-xs tracking-[0.2em] uppercase opacity-60">
                    Pg. {displayPage}
                </span>
            </div>

            {/* Bookmarks Modal Overlay */}
            {showBookmarks && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    onClick={() => setShowBookmarks(false)}
                >
                    <div
                        className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-2xl max-w-md w-full border border-[var(--color-primary)] border-opacity-20 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-6 text-[var(--color-text-primary)] font-serif text-center uppercase tracking-widest">Saved Pages</h2>

                        {bookmarks.length === 0 ? (
                            <p className="text-sm opacity-50 italic text-center py-4">No bookmarks saved.</p>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {bookmarks.map((b) => (
                                    <div key={b.id} className="flex items-center justify-between p-3 border border-[var(--color-primary)] border-opacity-20 rounded gap-2 hover:bg-[var(--color-primary)] hover:bg-opacity-5 transition-colors">
                                        <div
                                            className="flex-1 cursor-pointer overflow-hidden"
                                            onClick={() => handleLoad(b.state)}
                                        >
                                            <p className="font-serif font-bold text-sm truncate">{b.title}</p>
                                            <p className="text-xs opacity-60">Pg. {b.state.globalPageOffset + b.chapter} • {b.date}</p>
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

                        <button
                            onClick={() => setShowBookmarks(false)}
                            className="mt-6 w-full p-3 font-serif uppercase tracking-widest text-sm border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-bg-primary)] transition-colors"
                        >
                            Return to Book
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
